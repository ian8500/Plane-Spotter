import SwiftUI

struct AirportRowView: View {
    let airport: Airport

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(airport.icao)
                    .font(.headline)
                if let iata = airport.iata, !iata.isEmpty {
                    Text(iata)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Spacer()
            }
            Text(airport.name)
                .font(.subheadline.weight(.medium))
            if !airport.subtitle.isEmpty {
                Text(airport.subtitle)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 6)
    }
}

struct AirportRowView_Previews: PreviewProvider {
    static var previews: some View {
        List {
            AirportRowView(airport: Airport(
                id: 1,
                icao: "EGLL",
                iata: "LHR",
                name: "Heathrow Airport",
                city: "London",
                country: "United Kingdom",
                lat: 51.4700,
                lon: -0.4543,
                frequencies: [],
                spots: [],
                resources: []
            ))
        }
    }
}
