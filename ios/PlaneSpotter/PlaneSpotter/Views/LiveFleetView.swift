import SwiftUI

struct LiveFleetView: View {
    @EnvironmentObject private var environment: AppEnvironment
    @StateObject private var viewModel: LiveFleetViewModel

    @State private var registration = ""
    @State private var country = ""
    @State private var limit: Int

    init() {
        let initialViewModel = LiveFleetViewModel(apiClient: AppEnvironment.preview.apiClient)
        _viewModel = StateObject(wrappedValue: initialViewModel)
        _limit = State(initialValue: initialViewModel.lastQuery.limit)
    }

    var body: some View {
        content
            .navigationTitle("Live ADS-B")
            .task {
                viewModel.updateAPIClient(environment.apiClient)
                if case .idle = viewModel.state {
                    await performLoad()
                }
            }
            .refreshable {
                await performLoad()
            }
    }

    private var content: some View {
        List {
            filtersSection
            resultsSection
        }
        .listStyle(.insetGrouped)
    }

    private var filtersSection: some View {
        Section("Filters") {
            TextField("Registration", text: $registration)
                .textInputAutocapitalization(.characters)
                .disableAutocorrection(true)
                .onSubmit {
                    Task { await performLoad() }
                }
            TextField("Country", text: $country)
                .disableAutocorrection(true)
                .onSubmit {
                    Task { await performLoad() }
                }
            Stepper(value: $limit, in: viewModel.minimumLimitValue...viewModel.maximumLimit, step: 10) {
                HStack {
                    Text("Result limit")
                    Spacer()
                    Text("\(limit)")
                        .font(.body.monospacedDigit())
                        .foregroundStyle(.secondary)
                }
            }
            Button {
                Task { await performLoad() }
            } label: {
                Label("Apply Filters", systemImage: "arrow.triangle.2.circlepath")
                    .font(.callout.weight(.semibold))
            }
            .buttonStyle(.borderedProminent)
        } footer: {
            Text(filtersSummary)
        }
    }

    @ViewBuilder
    private var resultsSection: some View {
        Section("Results") {
            switch viewModel.state {
            case .idle, .loading:
                HStack {
                    Spacer()
                    ProgressView("Loading fleet data…")
                        .progressViewStyle(.circular)
                    Spacer()
                }
                .padding(.vertical)
            case let .failed(message):
                VStack(spacing: 12) {
                    Text("Unable to load fleet data")
                        .font(.headline)
                    Text(message)
                        .font(.subheadline)
                        .multilineTextAlignment(.center)
                        .foregroundStyle(.secondary)
                    Button {
                        Task { await performLoad() }
                    } label: {
                        Label("Try Again", systemImage: "arrow.clockwise")
                    }
                    .buttonStyle(.borderedProminent)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical)
            case let .loaded(response):
                let total = response.count
                Text("Found \(total) aircraft")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                if response.results.isEmpty {
                    Text("No aircraft matched your filters. Try broadening the search.")
                        .foregroundStyle(.secondary)
                        .padding(.vertical)
                } else {
                    let sorted = response.results.sorted { lhs, rhs in
                        lhs.displayRegistration < rhs.displayRegistration
                    }
                    ForEach(sorted, id: \.stableIdentifier) { aircraft in
                        aircraftRow(for: aircraft)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func aircraftRow(for aircraft: LiveAircraft) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
                Text(aircraft.displayRegistration)
                    .font(.headline)
                Spacer()
                if let country = aircraft.countryDisplay {
                    Text(country)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            if let airframe = aircraft.airframeSummary {
                Text(airframe)
                    .font(.subheadline)
            }
            if let operatorSummary = aircraft.operatorSummary {
                Text(operatorSummary)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
            if let owner = aircraft.ownerSummary, owner != (aircraft.operatorSummary ?? "") {
                Text(owner)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
            if let metadata = aircraft.metadataSummary {
                Text(metadata)
                    .font(.caption.monospacedDigit())
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 8)
    }

    private var filtersSummary: String {
        let registration = viewModel.lastQuery.registration?.uppercased()
        let country = viewModel.lastQuery.country
        var parts: [String] = []
        if let registration, !registration.isEmpty {
            parts.append("Registration contains \(registration)")
        }
        if let country, !country.isEmpty {
            parts.append("Country matches \(country)")
        }
        let limit = viewModel.lastQuery.limit
        let maxLimit = viewModel.maximumLimit
        if limit >= maxLimit {
            parts.append("Showing up to \(limit) aircraft (server max)")
        } else {
            parts.append("Showing up to \(limit) aircraft (max \(maxLimit))")
        }
        return parts.joined(separator: " · ")
    }

    @MainActor
    private func performLoad() async {
        viewModel.updateAPIClient(environment.apiClient)
        await viewModel.loadFleet(
            registration: registration,
            country: country,
            limit: limit
        )
        registration = viewModel.lastQuery.registration ?? ""
        country = viewModel.lastQuery.country ?? ""
        limit = viewModel.lastQuery.limit
    }
}
