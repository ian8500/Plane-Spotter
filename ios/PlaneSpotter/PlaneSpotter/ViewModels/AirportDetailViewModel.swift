import Foundation

@MainActor
final class AirportDetailViewModel: ObservableObject {
    enum State: Equatable {
        case idle
        case loading
        case loaded(Airport)
        case failed(String)
    }

    @Published private(set) var state: State = .idle

    private var apiClient: APIClient
    private let airportID: Int

    init(airportID: Int, apiClient: APIClient) {
        self.airportID = airportID
        self.apiClient = apiClient
    }

    func updateAPIClient(_ apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func load() async {
        state = .loading
        do {
            let airport: Airport = try await apiClient.get("airports/\(airportID)/")
            state = .loaded(airport)
        } catch {
            if let error = error as? APIClient.APIError {
                state = .failed(error.localizedDescription)
            } else {
                state = .failed(error.localizedDescription)
            }
        }
    }
}
