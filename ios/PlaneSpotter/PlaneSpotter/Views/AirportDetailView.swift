import SwiftUI
import MapKit

struct AirportDetailView: View {
    @EnvironmentObject private var environment: AppEnvironment
    @StateObject private var viewModel: AirportDetailViewModel

    init(airportID: Int) {
        _viewModel = StateObject(wrappedValue: AirportDetailViewModel(airportID: airportID, apiClient: AppEnvironment.preview.apiClient))
    }

    var body: some View {
        content
            .navigationBarTitleDisplayMode(.inline)
            .task {
                viewModel.updateAPIClient(environment.apiClient)
                if case .idle = viewModel.state {
                    await viewModel.load()
                }
            }
            .refreshable {
                viewModel.updateAPIClient(environment.apiClient)
                await viewModel.load()
            }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            LoadingView()
        case let .failed(message):
            ErrorView(message: message) {
                Task {
                    viewModel.updateAPIClient(environment.apiClient)
                    await viewModel.load()
                }
            }
        case let .loaded(airport):
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    header(for: airport)
                    if let coordinate = airport.coordinate {
                        Map(initialPosition: .region(MKCoordinateRegion(center: coordinate, span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)))) {
                            Marker(airport.icao, coordinate: coordinate)
                        }
                        .frame(height: 220)
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    }
                    frequenciesSection(for: airport)
                    spotsSection(for: airport)
                    resourcesSection(for: airport)
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle(airport.icao)
        }
    }

    private func header(for airport: Airport) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(airport.displayName)
                .font(.title.bold())
            if !airport.subtitle.isEmpty {
                Text(airport.subtitle)
                    .font(.headline)
                    .foregroundStyle(.secondary)
            }
            if let coordinate = airport.coordinate {
                Text(String(format: "Lat %.4f · Lon %.4f", coordinate.latitude, coordinate.longitude))
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func frequenciesSection(for airport: Airport) -> some View {
        Section {
            VStack(alignment: .leading, spacing: 12) {
                Text("Frequencies")
                    .font(.title3.bold())
                if airport.frequencies.isEmpty {
                    Text("No frequencies have been added yet.")
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(airport.frequencies) { frequency in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(frequency.service)
                                .font(.headline)
                            Text(frequency.formattedFrequency)
                                .font(.subheadline.monospaced())
                                .foregroundStyle(.blue)
                            if let description = frequency.description, !description.isEmpty {
                                Text(description)
                                    .font(.footnote)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(.background, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
                    }
                }
            }
        }
    }

    private func spotsSection(for airport: Airport) -> some View {
        Section {
            VStack(alignment: .leading, spacing: 12) {
                Text("Spotting Locations")
                    .font(.title3.bold())
                if airport.spots.isEmpty {
                    Text("No spotting locations recorded yet. Be the first to add one!")
                        .foregroundStyle(.secondary)
                } else {
                    VStack(spacing: 12) {
                        ForEach(airport.spots) { spot in
                            VStack(alignment: .leading, spacing: 8) {
                                Text(spot.title)
                                    .font(.headline)
                                if let description = spot.description, !description.isEmpty {
                                    Text(description)
                                        .font(.body)
                                }
                                if let coordinate = spot.coordinate {
                                    Text(String(format: "Lat %.4f · Lon %.4f", coordinate.latitude, coordinate.longitude))
                                        .font(.footnote)
                                        .foregroundStyle(.secondary)
                                }
                                if let tips = spot.tips, !tips.isEmpty {
                                    Text(tips)
                                        .font(.footnote)
                                        .foregroundStyle(.blue)
                                        .padding(10)
                                        .background(Color.blue.opacity(0.1), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                                }
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(.background, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
                        }
                    }
                }
            }
        }
    }

    private func resourcesSection(for airport: Airport) -> some View {
        Section {
            VStack(alignment: .leading, spacing: 12) {
                Text("Resources")
                    .font(.title3.bold())
                if airport.resources.isEmpty {
                    Text("No resources listed yet.")
                        .foregroundStyle(.secondary)
                } else {
                    VStack(spacing: 12) {
                        ForEach(airport.resources) { resource in
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Link(resource.title, destination: resource.url)
                                            .font(.headline)
                                        if let description = resource.description, !description.isEmpty {
                                            Text(description)
                                                .font(.footnote)
                                                .foregroundStyle(.secondary)
                                        }
                                    }
                                    Spacer()
                                    ResourceTagView(category: resource.category)
                                }
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(.background, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
                        }
                    }
                }
            }
        }
    }
}
