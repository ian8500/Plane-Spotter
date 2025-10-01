import SwiftUI

struct ErrorView: View {
    let title: String
    let message: String
    let retry: (() -> Void)?

    init(title: String = "Something went wrong", message: String, retry: (() -> Void)? = nil) {
        self.title = title
        self.message = message
        self.retry = retry
    }

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 44))
                .foregroundStyle(.orange)
            VStack(spacing: 6) {
                Text(title)
                    .font(.headline)
                Text(message)
                    .font(.subheadline)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
            }
            if let retry {
                Button(action: retry) {
                    Label("Try Again", systemImage: "arrow.clockwise")
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color.accentColor.opacity(0.12), in: Capsule())
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
