import SwiftUI

struct HomeSection: Identifiable {
    enum Destination {
        case airports
        case frequencyGuide
        case map
        case live
        case logbook
        case community
    }

    let id = UUID()
    let title: String
    let subtitle: String
    let systemImage: String
    let destination: Destination
    let accent: Color
}

struct ContentView: View {
    @EnvironmentObject private var environment: AppEnvironment

    private var sections: [HomeSection] {
        [
            HomeSection(title: "Airports", subtitle: "Spotting locations, reviews & photos", systemImage: "airplane.departure", destination: .airports, accent: .blue),
            HomeSection(title: "Frequencies", subtitle: "ATC communication primer", systemImage: "dot.radiowaves.left.and.right", destination: .frequencyGuide, accent: .purple),
            HomeSection(title: "Maps", subtitle: "Visualise airfields on a map", systemImage: "map", destination: .map, accent: .green),
            HomeSection(title: "Live ADS-B", subtitle: "Track active aircraft and filter by registration", systemImage: "radar", destination: .live, accent: .orange),
            HomeSection(title: "Logbook", subtitle: "Record aircraft you’ve spotted", systemImage: "note.text", destination: .logbook, accent: .teal),
            HomeSection(title: "Community", subtitle: "Forum, chat & badges", systemImage: "person.3", destination: .community, accent: .pink)
        ]
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Plane Spotter")
                            .font(.largeTitle.bold())
                        Text("Your complete plane spotting companion — explore airports, check frequencies, log aircraft, and connect with the spotting community.")
                            .foregroundStyle(.secondary)
                    }
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 160), spacing: 16)], spacing: 16) {
                        ForEach(sections) { section in
                            NavigationLink(value: section.destination) {
                                VStack(alignment: .leading, spacing: 12) {
                                    Image(systemName: section.systemImage)
                                        .font(.largeTitle)
                                        .foregroundStyle(section.accent)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    VStack(alignment: .leading, spacing: 6) {
                                        Text(section.title)
                                            .font(.headline)
                                        Text(section.subtitle)
                                            .font(.subheadline)
                                            .foregroundStyle(.secondary)
                                    }
                                    Spacer(minLength: 0)
                                }
                                .padding()
                                .frame(maxWidth: .infinity, minHeight: 150)
                                .background(.background, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                                .shadow(color: .black.opacity(0.08), radius: 10, x: 0, y: 4)
                            }
                        }
                    }
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationDestination(for: HomeSection.Destination.self) { destination in
                switch destination {
                case .airports:
                    AirportListView()
                        .environmentObject(environment)
                case .frequencyGuide:
                    FrequencyGuideView()
                case .map:
                    AirportMapView()
                        .environmentObject(environment)
                case .live:
                    LiveFleetView()
                        .environmentObject(environment)
                case .logbook:
                    PlaceholderView(title: "Logbook", message: "Connect to the /api/seen/ endpoint to sync spotted aircraft and maintain a personal logbook.")
                case .community:
                    PlaceholderView(title: "Community", message: "Hook into the posts, comments, and badges endpoints to deliver community features on iOS.")
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AppEnvironment(bundle: .main))
    }
}
