import SwiftUI

struct PlaceholderView: View {
    let title: String
    let message: String

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                Image(systemName: "hammer")
                    .font(.system(size: 48))
                    .foregroundStyle(.gray)
                Text(title)
                    .font(.title2.bold())
                Text(message)
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding()
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle(title)
    }
}
