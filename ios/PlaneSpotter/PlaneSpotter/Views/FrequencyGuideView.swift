import SwiftUI

struct FrequencyGuideView: View {
    struct Methodology: Identifiable {
        let id = UUID()
        let title: String
        let description: String
    }

    struct Exchange: Identifiable {
        let id = UUID()
        let call: String
        let meaning: String
    }

    private let methodology: [Methodology] = [
        Methodology(title: "Tower Operations", description: "Tower controllers manage aircraft in the immediate vicinity of the airport—typically the runway and traffic pattern. They issue takeoff and landing clearances, sequencing departures and arrivals to maintain safe separation."),
        Methodology(title: "Ground Control", description: "Ground handles aircraft and vehicles on taxiways and ramps. Controllers provide taxi clearances, monitor surface movement, and ensure conflicts are avoided before aircraft reach the runway."),
        Methodology(title: "Approach & Departure", description: "Approach and departure controllers transition aircraft between en-route airspace and the terminal area. They coordinate climbs, descents, and vectors to efficiently sequence flights around congested airspace."),
        Methodology(title: "Center / En-Route", description: "Air Route Traffic Control Centers oversee aircraft cruising between airports. They manage large sectors of airspace, coordinating altitude changes and hand-offs between adjacent sectors and facilities.")
    ]

    private let exchanges: [Exchange] = [
        Exchange(call: "ATIS", meaning: "Automatic Terminal Information Service broadcasts current weather, runways in use, and airport notices. Pilots state the letter code (e.g., 'Information Bravo') to confirm receipt when contacting controllers."),
        Exchange(call: "Clearance Delivery", meaning: "Provides IFR route clearance before taxi. Typical read-back includes the cleared route, initial altitude, departure frequency, and transponder code."),
        Exchange(call: "Taxi / Ground", meaning: "Ground control gives taxi instructions such as 'Taxi to Runway 27 via Alpha, hold short Runway 22'. Pilots must read back hold short instructions and runway assignments to confirm compliance."),
        Exchange(call: "Takeoff Clearance", meaning: "When tower issues 'Cleared for takeoff', the aircraft may enter the runway and depart. Pilots read back the clearance to acknowledge and begin the roll when safe."),
        Exchange(call: "Landing Clearance", meaning: "Tower communicates 'Cleared to land' once the runway is verified clear. Pilots acknowledge and continue final approach, reporting if unable or executing a go-around as necessary."),
        Exchange(call: "Handoff / Frequency Change", meaning: "Controllers coordinate handoffs between facilities. A call like 'Contact Departure on 118.5' prompts pilots to switch frequencies, check in, and continue on the new controller's instructions.")
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("ATC Communication Guide")
                        .font(.largeTitle.bold())
                    Text("Understand how Air Traffic Control orchestrates safe aircraft movement and what common radio telephony calls mean before you tune in.")
                        .font(.body)
                        .foregroundStyle(.secondary)
                }

                VStack(alignment: .leading, spacing: 16) {
                    Text("ATC Methodology")
                        .font(.title3.bold())
                    Text("Controllers coordinate flights through a series of specialised positions. Each role focuses on a specific phase of flight, ensuring clear responsibilities and consistent separation standards.")
                        .foregroundStyle(.secondary)
                    ForEach(methodology) { item in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(item.title)
                                .font(.headline)
                            Text(item.description)
                                .font(.body)
                                .foregroundStyle(.secondary)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(.background, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                        .shadow(color: .black.opacity(0.05), radius: 6, x: 0, y: 3)
                    }
                }

                VStack(alignment: .leading, spacing: 16) {
                    Text("Decoding RTF Exchanges")
                        .font(.title3.bold())
                    Text("Radio calls follow a predictable rhythm. Learning the intent behind each exchange helps you follow the story in real time and anticipate what comes next.")
                        .foregroundStyle(.secondary)
                    ForEach(exchanges) { item in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(item.call)
                                .font(.headline)
                            Text(item.meaning)
                                .font(.body)
                                .foregroundStyle(.secondary)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(.background, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                        .shadow(color: .black.opacity(0.05), radius: 6, x: 0, y: 3)
                    }
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("Looking for live audio?")
                        .font(.headline)
                    Text("Check the curated frequency list and streaming resources for your chosen airport. Add direct audio streaming integrations here.")
                        .foregroundStyle(.secondary)
                }
            }
            .padding()
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Frequencies")
    }
}
