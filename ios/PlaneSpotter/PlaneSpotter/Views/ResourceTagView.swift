import SwiftUI

struct ResourceTagView: View {
    let category: String

    private var label: String {
        switch category {
        case "map": return "Airfield Map"
        case "guide": return "Spotting Guide"
        case "official": return "Official"
        case "community": return "Community"
        case "video": return "Video"
        default: return "Resource"
        }
    }

    private var tint: Color {
        switch category {
        case "map": return Color.green.opacity(0.2)
        case "guide": return Color.blue.opacity(0.2)
        case "official": return Color.gray.opacity(0.2)
        case "community": return Color.purple.opacity(0.2)
        case "video": return Color.orange.opacity(0.2)
        default: return Color.gray.opacity(0.2)
        }
    }

    private var textColor: Color {
        switch category {
        case "map": return .green
        case "guide": return .blue
        case "official": return .gray
        case "community": return .purple
        case "video": return .orange
        default: return .gray
        }
    }

    var body: some View {
        Text(label)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .foregroundStyle(textColor)
            .background(tint, in: Capsule())
    }
}

struct ResourceTagView_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 12) {
            ResourceTagView(category: "map")
            ResourceTagView(category: "guide")
            ResourceTagView(category: "official")
            ResourceTagView(category: "community")
            ResourceTagView(category: "video")
            ResourceTagView(category: "other")
        }
        .padding()
        .previewLayout(.sizeThatFits)
    }
}
