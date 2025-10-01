import SwiftUI

struct LoadingView: View {
    var body: some View {
        VStack(spacing: 12) {
            ProgressView()
                .progressViewStyle(.circular)
            Text("Loading…")
                .font(.callout)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
}
