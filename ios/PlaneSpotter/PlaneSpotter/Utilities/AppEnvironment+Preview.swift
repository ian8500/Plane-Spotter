import Foundation

extension AppEnvironment {
    static var preview: AppEnvironment {
        AppEnvironment(bundle: .main, session: .shared)
    }
}
