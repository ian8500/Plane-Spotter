import Foundation

@MainActor
final class AirportListViewModel: ObservableObject {
    enum State: Equatable {
        case idle
        case loading
        case loaded([Airport])
        case failed(String)
    }

    @Published private(set) var state: State = .idle

    private var apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func updateAPIClient(_ apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func loadAirports() async {
        state = .loading
        do {
            let airports: [Airport] = try await apiClient.get("airports/")
            state = .loaded(airports.sorted(by: { $0.icao < $1.icao }))
        } catch {
            if let error = error as? APIClient.APIError {
                state = .failed(error.localizedDescription)
            } else {
                state = .failed(error.localizedDescription)
            }
        }
    }
}
