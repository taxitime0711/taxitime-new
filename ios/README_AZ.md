# TAXI TIME iOS V1.1 — Windows source paketi

Bu paket Windows-da redaktə edilə bilən SwiftUI mənbə kodudur. Mac olmadan Windows-da yerli iOS APK/IPA build etmək mümkün deyil. **IPA hazır deyil və kod iPhone-da test edilməyib.**

## Mövcud Worker V2.8.0 ilə uyğunlaşdırılan funksiyalar
- İctimai GET ilə server cavabının yoxlanması.
- `adminLogin` və `driverLogin` ilə real login sorğusu.
- Sürücü üçün bearer token ilə `driverOrders` və sifariş siyahısı.
- Admin maliyyə əməliyyatları, yeni sifariş yaratmaq və depozit endpoint-ləri bu paketdə aktiv DEYİL.
- Sessiya tokeni yalnız RAM-də saxlanır, tətbiq bağlandıqda itir.

## Bulud macOS build ardıcıllığı
1. Bu qovluğu öz GitHub repozitoriyanıza əlavə edin (secret/token/şifrə commit etməyin).
2. macOS build mühitində Xcode və XcodeGen quraşdırın.
3. `xcodegen generate` əmri ilə `TaxiTimeIOS.xcodeproj` yaradın.
4. Xcode-da signing team və unikal bundle ID seçin; iOS simulator üçün build edin.
5. Fiziki iPhone/TestFlight üçün Apple Developer signing və provisioning tələb olunur.
6. iPhone-da real Worker login və driverOrders sınağı aparın.

## Təhlükəsizlik
Mövcud Worker-in public GET cavabında sifariş və sürücü məlumatları ola bilər; iOS tətbiqində yalnız server statusu üçün istifadə edilir. Backend-in ictimai data səthini ayrıca məhdudlaşdırmaq tövsiyə olunur. iOS source-da heç bir GitHub tokeni və ya admin şifrəsi yoxdur.

## Qeyd
`project.yml` XcodeGen üçündür; Windows-da `xcodegen` işləmir. Bu layihə hələ istehsal buraxılışı deyil. iOS üçün tam Passenger, Driver, Admin funksiyaları mərhələli əlavə ediləcək.
