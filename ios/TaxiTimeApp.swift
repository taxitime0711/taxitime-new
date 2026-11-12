import SwiftUI
import Foundation

@main struct TaxiTimeApp: App {
    var body: some Scene { WindowGroup { MainScreen() } }
}

enum Role: String, CaseIterable, Identifiable {
    case passenger = "Passenger", driver = "Driver", admin = "Admin"
    var id: String { rawValue }
}

struct APIResult: Decodable {
    let ok: Bool?
    let error: String?
    let token: String?
    let orders: [Order]?
    let driver: DriverInfo?
}
struct DriverInfo: Decodable {
    let id: String?
    let name: String?
}
struct Order: Decodable, Identifiable {
    let id: String
    let status: String?
    let from: String?
    let to: String?
    let price: Double?
    // Other fields in the Worker JSON are intentionally ignored.
    enum CodingKeys: String, CodingKey { case id, status, from, to, price }
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        func str(_ key: CodingKeys) -> String? { try? c.decodeIfPresent(String.self, forKey: key) }
        id = str(.id) ?? UUID().uuidString
        status = str(.status); from = str(.from); to = str(.to)
        price = (try? c.decodeIfPresent(Double.self, forKey: .price)) ?? Double(str(.price) ?? "")
    }
}

actor TaxiAPI {
    static let shared = TaxiAPI()
    private let base = URL(string: "https://taxitime-api.taxitime0711.workers.dev/")!
    func get() async throws -> Data { try await send(method: "GET", body: nil, token: nil) }
    func post(_ fields: [String: String], token: String? = nil) async throws -> Data {
        try await send(method: "POST", body: try JSONSerialization.data(withJSONObject: fields), token: token)
    }
    private func send(method: String, body: Data?, token: String?) async throws -> Data {
        var req = URLRequest(url: base)
        req.httpMethod = method
        req.timeoutInterval = 20
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token { req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization") }
        req.httpBody = body
        let (data, response) = try await URLSession.shared.data(for: req)
        guard let http = response as? HTTPURLResponse else { throw AppError.message("Server cavab vermədi") }
        if !(200..<300).contains(http.statusCode) {
            let result = try? JSONDecoder().decode(APIResult.self, from: data)
            throw AppError.message(result?.error ?? "HTTP \(http.statusCode)")
        }
        if let result = try? JSONDecoder().decode(APIResult.self, from: data), result.ok == false {
            throw AppError.message(result.error ?? "Server xətası")
        }
        return data
    }
}

enum AppError: LocalizedError {
    case message(String)
    var errorDescription: String? { if case .message(let m) = self { return m }; return nil }
}

struct MainScreen: View {
    @State private var role: Role = .passenger
    @State private var departure = ""
    @State private var destination = ""
    @State private var login = ""
    @State private var password = ""
    @State private var token: String? = nil // Memory only: do not persist sensitive session credentials.
    @State private var orders: [Order] = []
    @State private var info = ""
    @State private var loading = false
    var body: some View {
        NavigationStack {
            Form {
                Section("Tətbiq") {
                    Picker("Rejim", selection: $role) { ForEach(Role.allCases) { Text($0.rawValue).tag($0) } }
                        .onChange(of: role) { _ in token = nil; orders = []; password = ""; info = "" }
                    Text("TAXI TIME iOS — sınaq mənbə kodu").font(.footnote).foregroundStyle(.secondary)
                }
                if role == .driver || role == .admin {
                    Section("Təhlükəsiz giriş") {
                        TextField("Login", text: $login).textInputAutocapitalization(.never).autocorrectionDisabled()
                        SecureField("Şifrə", text: $password)
                        if token == nil {
                            Button("Daxil ol") { Task { await signIn() } }.disabled(loading || login.isEmpty || password.isEmpty)
                        } else {
                            Button("Çıxış") { token = nil; orders = []; password = "" }
                        }
                    }
                }
                Section("Bağlantı") {
                    Button("Serveri yoxla") { Task { await ping() } }.disabled(loading)
                    if !info.isEmpty { Text(info).font(.footnote) }
                }
                if role == .driver, token != nil {
                    Section("Mənim sifarişlərim") {
                        Button("Sifarişləri yenilə") { Task { await loadDriverOrders() } }.disabled(loading)
                        if orders.isEmpty { Text("Sifariş yoxdur və ya hələ yüklənməyib").foregroundStyle(.secondary) }
                        ForEach(orders) { order in
                            VStack(alignment: .leading, spacing: 5) {
                                Text("Sifariş: \(order.id)").font(.headline)
                                Text("\(order.from ?? "—") → \(order.to ?? "—")")
                                Text(order.status ?? "Status yoxdur").foregroundStyle(.secondary)
                            }
                        }
                    }
                }
                if role == .passenger {
                    Section("Marşrut seçimi") {
                        TextField("Haradan? Məsələn: Bakı", text: $departure)
                        TextField("Haraya? Məsələn: Quba", text: $destination)
                    }
                    Section("Sifariş məlumatları") {
                        if departure.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ||
                            destination.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                            Text("Marşrutu daxil edin").foregroundStyle(.secondary)
                        } else {
                            Text("\(departure) → \(destination)").font(.headline)
                            Text("Sifariş növü: Bütöv avtomobil")
                        }
                        Text("Qiymət Admin tarifinə əsasən hesablanacaq").foregroundStyle(.secondary)
                        Button("Qiyməti hesabla") {}.disabled(true)
                        Button("Sifariş yarat") {}.disabled(true)
                    }
                    Section("Məlumat") {
                        Text("Bu ekran V1.2 sınaq versiyasıdır. Qiymət və sifariş funksiyaları server inteqrasiyasından sonra aktivləşəcək.")
                            .font(.footnote).foregroundStyle(.secondary)
                    }
                }
                if role == .admin, token != nil {
                    Section("Admin") {
                        Text("Giriş təsdiqləndi. Sifarişlərin idarə edilməsi və maliyyə əməliyyatları ayrıca icazəli API inteqrasiyası tamamlanana qədər bağlıdır.")
                    }
                }
                Section("Planlaşdırılan funksiyalar") {
                    Text("Sürücü təklifləri, 10% komissiya, depozit və borc funksiyaları Worker-də təsdiqlənmiş endpoint-lər yaradıldıqdan sonra qoşulacaq.")
                        .font(.footnote).foregroundStyle(.secondary)
                }
            }
            .navigationTitle("TAXI TIME")
        }
    }
    @MainActor private func ping() async {
        loading = true; defer { loading = false }
        do { _ = try await TaxiAPI.shared.get(); info = "Server cavab verdi" }
        catch { info = error.localizedDescription }
    }
    @MainActor private func signIn() async {
        loading = true; defer { loading = false }
        let action = role == .driver ? "driverLogin" : "adminLogin"
        do {
            let data = try await TaxiAPI.shared.post(["action":action,"login":login,"password":password])
            let result = try JSONDecoder().decode(APIResult.self, from: data)
            guard let t = result.token, !t.isEmpty else { throw AppError.message("Token alınmadı") }
            token = t; password = ""; info = "Giriş uğurludur"
        } catch { info = error.localizedDescription }
    }
    @MainActor private func loadDriverOrders() async {
        guard let token else { return }
        loading = true; defer { loading = false }
        do {
            let data = try await TaxiAPI.shared.post(["action":"driverOrders"], token: token)
            let result = try JSONDecoder().decode(APIResult.self, from: data)
            orders = result.orders ?? []
            info = "Sifarişlər yeniləndi"
        } catch { info = error.localizedDescription }
    }
}
