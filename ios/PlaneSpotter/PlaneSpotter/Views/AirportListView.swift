import SwiftUI

struct AirportListView: View {
    @EnvironmentObject private var environment: AppEnvironment
    @StateObject private var viewModel: AirportListViewModel
    @State private var searchText = ""

    init() {
        _viewModel = StateObject(wrappedValue: AirportListViewModel(apiClient: AppEnvironment.preview.apiClient))
    }

    var body: some View {
        content
            .navigationTitle("Airports")
            .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
            .task {
                viewModel.updateAPIClient(environment.apiClient)
                if case .idle = viewModel.state {
                    await viewModel.loadAirports()
                }
            }
            .refreshable {
                viewModel.updateAPIClient(environment.apiClient)
                await viewModel.loadAirports()
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
                    await viewModel.loadAirports()
                }
            }
        case let .loaded(airports):
            let filtered = airports.filter { airport in
                searchText.isEmpty ? true : airportMatchesSearch(airport)
            }
            List(filtered) { airport in
                NavigationLink(value: airport.id) {
                    AirportRowView(airport: airport)
                }
            }
            .listStyle(.insetGrouped)
            .navigationDestination(for: Int.self) { id in
                AirportDetailView(airportID: id)
                    .environmentObject(environment)
            }
        }
    }

    private func airportMatchesSearch(_ airport: Airport) -> Bool {
        let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty else { return true }
        let haystack = [airport.icao, airport.iata ?? "", airport.name, airport.city ?? "", airport.country]
            .joined(separator: " ")
            .lowercased()
        return haystack.contains(query.lowercased())
    }
}
