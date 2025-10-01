import Foundation
import CoreLocation

struct Airport: Identifiable, Decodable, Equatable {
    struct Frequency: Identifiable, Decodable, Equatable {
        let id: Int
        let service: String
        let mhz: String
        let description: String?

        var formattedFrequency: String {
            if let value = Double(mhz) {
                return String(format: "%.3f MHz", value)
            }
            return "\(mhz) MHz"
        }
    }

    struct SpottingLocation: Identifiable, Decodable, Equatable {
        let id: Int
        let title: String
        let description: String?
        let tips: String?
        let lat: Double?
        let lon: Double?

        var coordinate: CLLocationCoordinate2D? {
            guard let lat, let lon else { return nil }
            return CLLocationCoordinate2D(latitude: lat, longitude: lon)
        }
    }

    struct Resource: Identifiable, Decodable, Equatable {
        let id: Int
        let title: String
        let url: URL
        let category: String
        let description: String?
    }

    let id: Int
    let icao: String
    let iata: String?
    let name: String
    let city: String?
    let country: String
    let lat: Double?
    let lon: Double?
    let frequencies: [Frequency]
    let spots: [SpottingLocation]
    let resources: [Resource]

    var coordinate: CLLocationCoordinate2D? {
        guard let lat, let lon else { return nil }
        return CLLocationCoordinate2D(latitude: lat, longitude: lon)
    }

    var displayName: String {
        "\(icao) · \(name)"
    }

    var subtitle: String {
        let location = [city, country].compactMap { $0?.isEmpty == false ? $0 : nil }.joined(separator: ", ")
        return location.isEmpty ? "" : location
    }
}
