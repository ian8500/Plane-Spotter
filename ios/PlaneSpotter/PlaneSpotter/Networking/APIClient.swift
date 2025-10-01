import Foundation

struct APIClient {
    struct APIError: LocalizedError {
        enum ErrorType {
            case invalidURL
            case transport(Error)
            case decoding(Error)
            case server(status: Int)
        }

        let type: ErrorType

        var errorDescription: String? {
            switch type {
            case .invalidURL:
                return "The request URL was invalid."
            case let .transport(error):
                return error.localizedDescription
            case let .decoding(error):
                return "Failed to decode response: \(error.localizedDescription)"
            case let .server(status):
                return "Server returned status code \(status)."
            }
        }
    }

    var baseURL: URL
    var session: URLSession

    init(baseURL: URL, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    func get<T: Decodable>(_ path: String, queryItems: [URLQueryItem] = []) async throws -> T {
        guard var components = URLComponents(url: baseURL.appendingPathComponent(path), resolvingAgainstBaseURL: false) else {
            throw APIError(type: .invalidURL)
        }
        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }
        guard let url = components.url else {
            throw APIError(type: .invalidURL)
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        do {
            let (data, response) = try await session.data(for: request)
            if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
                throw APIError(type: .server(status: httpResponse.statusCode))
            }
            let decoder = JSONDecoder()
            decoder.keyDecodingStrategy = .convertFromSnakeCase
            decoder.dateDecodingStrategy = .iso8601
            return try decoder.decode(T.self, from: data)
        } catch let error as APIError {
            throw error
        } catch let error as DecodingError {
            throw APIError(type: .decoding(error))
        } catch {
            throw APIError(type: .transport(error))
        }
    }
}
