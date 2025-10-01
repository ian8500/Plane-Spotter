import Foundation

@MainActor
final class AppEnvironment: ObservableObject {
    let apiClient: APIClient

    init(bundle: Bundle = .main, session: URLSession = .shared) {
        let defaultURL = URL(string: "http://localhost:8000/api")!
        if let baseURLString = bundle.object(forInfoDictionaryKey: "API_BASE_URL") as? String,
           let parsedURL = URL(string: baseURLString) {
            self.apiClient = APIClient(baseURL: parsedURL, session: session)
        } else {
            self.apiClient = APIClient(baseURL: defaultURL, session: session)
        }
    }
}
