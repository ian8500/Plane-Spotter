import Foundation

@MainActor
final class LiveFleetViewModel: ObservableObject {
    struct Query: Equatable {
        var registration: String?
        var country: String?
        var limit: Int

        var hasFilters: Bool {
            registration != nil || country != nil
        }
    }

    enum State: Equatable {
        case idle
        case loading
        case loaded(LiveFleetResponse)
        case failed(String)
    }

    @Published private(set) var state: State = .idle
    @Published private(set) var lastQuery: Query

    private var apiClient: APIClient
    private let minimumLimit: Int
    let maximumLimit: Int

    var minimumLimitValue: Int { minimumLimit }

    init(apiClient: APIClient, defaultLimit: Int = 50, minimumLimit: Int = 10, maximumLimit: Int = 200) {
        self.apiClient = apiClient
        self.minimumLimit = minimumLimit
        self.maximumLimit = maximumLimit
        self.lastQuery = Query(registration: nil, country: nil, limit: defaultLimit)
    }

    func updateAPIClient(_ apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func loadFleet(registration: String?, country: String?, limit: Int) async {
        let trimmedRegistration = registration?.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedCountry = country?.trimmingCharacters(in: .whitespacesAndNewlines)
        let sanitizedRegistration = (trimmedRegistration?.isEmpty == false) ? trimmedRegistration : nil
        let sanitizedCountry = (trimmedCountry?.isEmpty == false) ? trimmedCountry : nil
        let sanitizedLimit = max(minimumLimit, min(limit, maximumLimit))

        let query = Query(registration: sanitizedRegistration, country: sanitizedCountry, limit: sanitizedLimit)
        lastQuery = query
        state = .loading

        do {
            var queryItems = [URLQueryItem(name: "limit", value: String(query.limit))]
            if let registration = query.registration {
                queryItems.append(URLQueryItem(name: "registration", value: registration))
            }
            if let country = query.country {
                queryItems.append(URLQueryItem(name: "country", value: country))
            }

            let response: LiveFleetResponse = try await apiClient.get("fleet/live/", queryItems: queryItems)
            state = .loaded(response)
        } catch {
            if let apiError = error as? APIClient.APIError {
                state = .failed(apiError.localizedDescription)
            } else {
                state = .failed(error.localizedDescription)
            }
        }
    }
}
