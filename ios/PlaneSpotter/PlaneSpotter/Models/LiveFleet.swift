import Foundation

struct LiveFleetResponse: Decodable, Equatable {
    struct Filters: Decodable, Equatable {
        let registration: String?
        let country: String?
    }

    let count: Int
    let results: [LiveAircraft]
    let filters: Filters?
}

struct LiveAircraft: Decodable, Equatable {
    let icao24: String
    let registration: String
    let manufacturer: String
    let model: String
    let typeCode: String
    let icaoAircraftType: String
    let operatorName: String
    let operatorCallsign: String
    let owner: String
    let serialNumber: String
    let built: String
    let country: String

    enum CodingKeys: String, CodingKey {
        case icao24
        case registration
        case manufacturer
        case model
        case typeCode
        case icaoAircraftType
        case operatorName = "operator"
        case operatorCallsign
        case owner
        case serialNumber
        case built
        case country
    }
}

extension LiveAircraft {
    var displayRegistration: String {
        let trimmedRegistration = registration.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedRegistration.isEmpty {
            return trimmedRegistration.uppercased()
        }
        let hexValue = icao24.trimmingCharacters(in: .whitespacesAndNewlines)
        return hexValue.isEmpty ? "Unknown" : hexValue.uppercased()
    }

    var airframeSummary: String? {
        let manufacturerValue = manufacturer.trimmingCharacters(in: .whitespacesAndNewlines)
        let modelValue = model.trimmingCharacters(in: .whitespacesAndNewlines)
        let typeCodeValue = typeCode.trimmingCharacters(in: .whitespacesAndNewlines)
        let icaoTypeValue = icaoAircraftType.trimmingCharacters(in: .whitespacesAndNewlines)

        if !manufacturerValue.isEmpty || !modelValue.isEmpty {
            return [manufacturerValue, modelValue].filter { !$0.isEmpty }.joined(separator: " ")
        }
        if !typeCodeValue.isEmpty {
            return typeCodeValue
        }
        if !icaoTypeValue.isEmpty {
            return icaoTypeValue
        }
        return nil
    }

    var operatorSummary: String? {
        let operatorValue = operatorName.trimmingCharacters(in: .whitespacesAndNewlines)
        let callsignValue = operatorCallsign.trimmingCharacters(in: .whitespacesAndNewlines)

        let parts = [operatorValue, callsignValue].filter { !$0.isEmpty }
        return parts.isEmpty ? nil : parts.joined(separator: " · ")
    }

    var ownerSummary: String? {
        let ownerValue = owner.trimmingCharacters(in: .whitespacesAndNewlines)
        return ownerValue.isEmpty ? nil : ownerValue
    }

    var metadataSummary: String? {
        let hexValue = icao24.trimmingCharacters(in: .whitespacesAndNewlines)
        let serialValue = serialNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        let builtValue = built.trimmingCharacters(in: .whitespacesAndNewlines)

        var parts: [String] = []
        if !hexValue.isEmpty {
            parts.append("ICAO24 \(hexValue.uppercased())")
        }
        if !serialValue.isEmpty {
            parts.append("MSN \(serialValue)")
        }
        if !builtValue.isEmpty {
            parts.append("Built \(builtValue)")
        }
        return parts.isEmpty ? nil : parts.joined(separator: " • ")
    }

    var countryDisplay: String? {
        let countryValue = country.trimmingCharacters(in: .whitespacesAndNewlines)
        return countryValue.isEmpty ? nil : countryValue
    }

    var stableIdentifier: String {
        let hexValue = icao24.trimmingCharacters(in: .whitespacesAndNewlines)
        if !hexValue.isEmpty {
            return hexValue.lowercased()
        }
        let registrationValue = registration.trimmingCharacters(in: .whitespacesAndNewlines)
        if !registrationValue.isEmpty {
            return "reg-\(registrationValue.uppercased())"
        }
        let serialValue = serialNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        if !serialValue.isEmpty {
            return "serial-\(serialValue)"
        }
        let fallback = [manufacturer, model, owner, country]
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() }
            .filter { !$0.isEmpty }
            .joined(separator: "-")
        return fallback.isEmpty ? "aircraft-unknown" : fallback
    }
}
