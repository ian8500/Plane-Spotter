import SwiftUI
import MapKit

private struct AnnotatedAirport: Identifiable {
    let id: Int
    let airport: Airport
    let coordinate: CLLocationCoordinate2D
}

struct AirportMapView: View {
    @EnvironmentObject private var environment: AppEnvironment
    @StateObject private var listViewModel: AirportListViewModel
    @State private var position: MapCameraPosition = .automatic

    init() {
        _listViewModel = StateObject(wrappedValue: AirportListViewModel(apiClient: AppEnvironment.preview.apiClient))
    }

    var body: some View {
        content
            .navigationTitle("Maps")
            .task {
                listViewModel.updateAPIClient(environment.apiClient)
                if case .idle = listViewModel.state {
                    await listViewModel.loadAirports()
                }
            }
    }

    @ViewBuilder
    private var content: some View {
        switch listViewModel.state {
        case .idle, .loading:
            LoadingView()
        case let .failed(message):
            ErrorView(message: message) {
                Task {
                    listViewModel.updateAPIClient(environment.apiClient)
                    await listViewModel.loadAirports()
                }
            }
        case let .loaded(airports):
            let annotatedAirports = airports.compactMap { airport -> AnnotatedAirport? in
                guard let coordinate = airport.coordinate else { return nil }
                return AnnotatedAirport(id: airport.id, airport: airport, coordinate: coordinate)
            }
            Map(position: $position, interactionModes: .all) {
                ForEach(annotatedAirports) { item in
                    Annotation(item.airport.icao, coordinate: item.coordinate) {
                        VStack(spacing: 4) {
                            Text(item.airport.icao)
                                .font(.caption.bold())
                                .padding(6)
                                .background(.ultraThinMaterial, in: Capsule())
                            Image(systemName: "airplane")
                                .padding(6)
                                .background(Color.accentColor, in: Circle())
                                .foregroundStyle(.white)
                        }
                    }
                }
            }
            .mapStyle(.standard(elevation: .realistic))
            .overlay(alignment: .bottom) {
                if !airports.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(airports) { airport in
                                Button {
                                    if let coordinate = airport.coordinate {
                                        withAnimation(.easeInOut) {
                                            position = .region(MKCoordinateRegion(center: coordinate, span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)))
                                        }
                                    }
                                } label: {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(airport.icao)
                                            .font(.headline)
                                        Text(airport.name)
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }
                                    .padding()
                                    .background(.background, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                                    .shadow(color: .black.opacity(0.08), radius: 6, x: 0, y: 3)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.vertical, 8)
                    .background(.thinMaterial)
                }
            }
        }
    }
}
