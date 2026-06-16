# PMS Rezervasyon Veri Giriş Talimatnamesi
## Elektra, Sedna & Veboni Optimum Uygulamalar

**Versiyon:** 1.0  
**Tarih:** 2026-06-16  
**Geçerli Sistemler:** PPG (Elektra, Sedna, Veboni PMS)  
**URL:** ppg.pmapartner.com

---

## 1. GİRİŞ VE AMAÇ

Bu talimatname, otel PMS sistemlerine rezervasyon girilirken sıkça yapılan hataları önlemek ve doğru veri giriş metodolojisini tanımlamak amaçlıdır.

**Neden önemlidir?**
- **ADR (Average Daily Rate) Bozulması:** Toplu rezervasyonlar yanlış yönetilirse ortalama oda fiyatını çarpıtan veriler oluşur
- **Mali Raporlama Hatası:** Yanlış kategorizasyon nedeniyle Revenue, Occupancy ve Forecast değerleri hatalı hesaplanır
- **Operasyonel Kaos:** Eksik girilen bilgiler ertesi gün değiştirilmek zorunda kalır, oda tahsisi ve check-in akışını bozar
- **Entegrasyon Kırılması:** Market/Country çakışması ve acente seçimi hataları, Booking.com, Airbnb, GDS kanallarında otomatik senkronizasyon başarısızlığına yol açar

---

## 2. REZERVASYON GİRİŞ ÖNCESİ KONTROL LİSTESİ

Hiçbir rezervasyon girilmeden önce bu soruları cevaplayın:

### 2.1 Temel Bilgiler
- [ ] **Misafir adı ve soyadı tam olarak yazılı mı?**
- [ ] **Check-in ve check-out tarihleri kesin mi?** (Sonradan değişmeyecek mi?)
- [ ] **Oda tipi ve oda sayısı doğru mu?** (Tek oda mı, çoklu oda mı?)
- [ ] **Toplam konaklama sayısı kaç gece?** (Tarihler ve geceleri doğrula)

### 2.2 Finansal Bilgiler
- [ ] **Rezervasyon tarifeleri (ADR) tanımlanmış mı?** (Boş bırakma, sonrası)
- [ ] **Ödeme türü belirlenmiş mi?** (Peşin, Check-in, Check-out, Kontrat)
- [ ] **İndirim/Commission bilgisi var mı?** (Varsa yüzde ve tutarı)
- [ ] **Vergiler ve ek ücretler hesaplanacak mı?** (Maliyet merkezine göre değişir)

### 2.3 Kaynak & Acente Bilgileri
- [ ] **Rezervasyon hangi kanaldan geldi?** (Booking.com, Direct, Telefon, AcenteX)
- [ ] **Acente/OTA'nın PPG sisteminde tanımlanmış hesabı var mı?**
- [ ] **Acente ülkesi (Country) doğru mu?** (Türkiye'den telefon rezervasyonu = TR değil, kaynağın ülkesi seçilir)
- [ ] **Market parametresi kontrat şartlarıyla uyumlu mu?**

### 2.4 Statü & Kategori Belirlenmesi
- [ ] **Rezervasyon tipi ne?** (Normal Konuk, Group, House Use, Complementary, Kontrat)
- [ ] **House Use mi, Complementary mi, Normal mi?** (Sadece biri seçilmeli)
- [ ] **Kontrat/Allotment kaynaklı mı?** (Evet ise hangi kontrat?)
- [ ] **Grup olarak girilmesi gerekiyor mu?** (Bireysel mi, grup mu?)

---

## 3. YAYGIŞN HATALAR VE NEDENLERİ

### 🔴 HATA 1: Toplu Rezervasyonları Tek Odaya Girme

**Sorun:** 10 odalık bir grup rezervasyonu, 10 ayrı tek oda kaydı yerine 1 rezervasyon kaydına tüm gece sayısı girilir.

**Sonuç:**
- Sistem 1 odayı 10 gece için rezerve etmiş sayar
- ADR hesaplaması çarpılır: `Toplam Revenue / 1 oda` yerine `Toplam Revenue / 10 oda`
- Occupancy (İşgal Oranı) hatalı olur
- Revenue raporları oda başına yazılırken tüm tutarı tek odaya atar

**Doğru Yapılışı:**
```
❌ YANLIŞ:
- 1 rezervasyon kaydı
- Oda 101
- Geceleri: 10 gece (20-30 Haziran)
- Toplam Tutar: 10.000 TL (bir odaya 10.000 yazarsanız ADR = 10.000 TL/gece olur)

✅ DOĞRU:
- 10 ayrı rezervasyon (veya "Group" olarak toplu grup kaydı)
- Odalar: 101, 102, 103, 104, 105, 106, 107, 108, 109, 110
- Her biri: 10 gece (20-30 Haziran)
- Her oda: 1.000 TL (Toplam 10.000 TL, ADR = 1.000 TL/gece)

VEYA Grup Modunda:
- 1 grup kaydı, "Grup Başlığı: ABC Turizm Firması"
- Alt kayıtlar: 10 oda
- Her oda 1.000 TL
```

**Elektra/Sedna/Veboni Fark:**
- **Elektra:** "Group Reservation" modu vardır, birden çok odayı tek başlık altında yönetebilirsiniz
- **Sedna:** ROOM_RESERVATION tablosunda GROUP_ID ile linklenebilir
- **Veboni:** Oracle multi-tenant lookup table kullanır, ayrı ROOM_NUM kayıtları şart

**Kaçınılması Gereken Durum:**
- Acente telefon araması sonrası "5 oda, 7 gece" kişisel ek boş bilgiler olmadan direkt giriş
- Hattıkiyle hesaplanan ADR'nin sisteme yansıtılmaması

---

### 🔴 HATA 2: House Use ve Complementary Ayrımının Yanlışması

**Sorun:** "House Use (personel, aile, test konuk)" ile "Complementary (complimentary oda, ödüllü konaklama)" birbirinin yerine kullanılır.

**Sonuç:**
- House Use'lar Revenue olarak sayılır (vergi müdürlüğüne danışıldığında sorun)
- Complementary odalar revenue'ye dahil edilir, aslında sıfır gelir olması gerekiyorken
- Mali denetimde tutarsızlıklar ortaya çıkar

**Tanımlamalar:**
| Tür | Tanım | Revenue | Occupancy | Vergi | Örnek |
|-----|-------|---------|-----------|-------|-------|
| **Complementary** | Misafire hediye oda | ❌ Hayır (0 TL) | ✅ Evet | ❌ Hayır | Loyalty ödülü, hata telafisi |
| **House Use** | Personel/Aile konaklaması | ✅ Evet* | ✅ Evet | ⚠️ Kontrol et | Operatör test, sahibin misafiri |
| **Normal Reservation** | Ödeme yapan misafir | ✅ Evet | ✅ Evet | ✅ Evet | Standart rezervasyon |
| **Group** | 3+ oda toplu | ✅ Evet | ✅ Evet | ✅ Evet | Tur operatörü, şirket |

*House Use'ın Revenue olarak sayılıp sayılmayacağı otel müdürü/muhasebeden teyit alınmalıdır.

**Doğru Yapılışı:**

```
Senaryo 1 - Complementary:
- Misafir: Çiçek tarafından ödül oda
- Kategori: "COMPLEMENTARY" seç
- Tutar: 0 TL (tutar girilmemelidir)
- Occupancy: Sayılır
- İçerikte not: "Çiçek Loyalty Ödülü #2026/001"

Senaryo 2 - House Use:
- Misafir: Otel müdürünün akrabası
- Kategori: "HOUSE USE" seç
- Tutar: 200 TL (varsa iç fiyatlandırma)
- Occupancy: Sayılır
- İçerikte not: "Test / Personel Aile"

Senaryo 3 - Normal:
- Misafir: Booking.com üzerinden
- Kategori: Normal
- Tutar: 500 TL
- Occupancy: Sayılır
- Commission: -75 TL (Booking %15)
```

**PMS'de Etiketi Doğru Seçme:**

| Sistem | Field Adı | Doğru Seçim |
|--------|-----------|-------------|
| **Elektra** | Guest Type / Reservation Type | Complementary / House Use dropdown |
| **Sedna** | RESERVATION_TYPE | 3=House, 4=Complement, 1=Normal |
| **Veboni** | RES_TYPE / RATE_CODE | HOU / COM / STD |

---

### 🔴 HATA 3: Market/Country Parametrelerinde Çakışma

**Sorun:** Rezervasyon kaynağı (acente/OTA) ile ülke seçimi uyumsuz olur.

**Örnekler:**

```
❌ YANLIŞ SEÇIMLER:

1. Telefon Rezervasyonu:
   - Arama: +49 (Almanya numarasından) arayor
   - Giriş: Country = Germany, Market = OTA
   → Doğru değil: Kişi Almanya'dan araşa da Channel = Direct Phone olmalı

2. Acente Rezervasyonu:
   - Acente: "Bursa Turizm Ltd."
   - Giriş: Country = Germany (Acente Türkiye'de, misafirler Alman)
   → Ambiguity: Acente'nin ülkesi mi, misafirlerin ülkesi mi?

3. Booking.com via Acente:
   - Booking üzerinden ön ayarlanmış acente
   - Giriş: Channel = Direct, Country = Booking
   → Senkronizasyon sorunu: Booking kanalından gelen veri "Channel=Booking" olmalı
```

**Doğru Mantık:**

```
1. CHANNEL (Kanal) Seçimi = Rezervasyon nereden geldi?
   ✅ Direct (Direkt Otel)
   ✅ Booking.com
   ✅ Airbnb
   ✅ GDS (Sabre, Amadeus)
   ✅ Acente Adı (Phone, Email)
   ✅ Walk-in

2. MARKET / COUNTRY = Misafir/Acente kaynağının ülkesi
   ✅ Misafir milliyeti VEYA Acente'nin bulunduğu ülke
   ✅ Booking.com'dan gelmişse → Country = Booking'in ülke algısı (otomatik)
   ✅ Telefon rezervasyonundan → Telefon numarası ülke koduna göre
   ✅ Acente → Acente'nin kayıtlı ülkesi

3. Kontrat/Rate Code = Fiyatlandırma türü
   ✅ Booking Commission %15
   ✅ Acente Contract XYZ
   ✅ Corporate Rate
   ✅ Walk-in Discount %10
```

**Entegrasyon Sonuçları:**

| Kanal | Country | Effect | Risk |
|-------|---------|--------|------|
| Booking.com | UK (misafir) | ✅ Doğru, Booking kanalına yazılır | ❌ Duplicate: Country yanlışsa çift rezervasyon |
| Acente "ABC" | Turkey | ✅ Doğru, acente lokal | ⚠️ Manual senkronizasyon eksik |
| Direct Website | Germany | ✅ Doğru (website'den talep) | ❌ Website'de ülke dropdown'u kullanılmalı |
| GDS | Mixture | ⚠️ GDS kendi ülke belirler | ❌ GDS override kontrolü |

---

### 🔴 HATA 4: Kontrat/Allotment Kaynaklı Ücretler İçin Statü Tanımlanmaması

**Sorun:** İndirimli veya ücretsiz odalar ("kontrat gereği koşulsuz"), standart ücretli odalar ile aynı şekilde girilir.

**Sonuçlar:**
- Kontrat odalarına ait Commission/Markup'lar Booking'in yerine otelde tahsillenmiş olur
- Oda satış başarısı rakamlı olarak yüksek görünür (aslında allotment) 
- Revenue forecasting bozulur

**Kontrat Türleri:**

| Tür | Tanım | ADR Etkisi | Örnek |
|-----|-------|-----------|-------|
| **Allotment** | Önceden belirlenmiş oda kotası | Kontrat fiyatı uygulanır | Tour Operator: 20 oda @ 200 TL/gece |
| **Reciprocal** | Karşılıklı oda alışverişi | 0 TL (ücretsize yakın) | Otel A ↔ Otel B anlaşması |
| **Corporate** | Şirket çalışanları için | İndirimli ücret | Microsoft Çalışanları: -25% |
| **Educational** | Öğrenci/Öğretmen | İndirimli ücret | Üniversite Protokolü: -30% |
| **Government** | Kamu görevlileri | Özel ücret | Kaymakam Konaklama: 150 TL/gece |
| **Free Inventory** | Promosyon odaları | 0 TL | Açılış kampanyası |

**Doğru Yapılışı:**

```
SENARYO: Booking.com aracılığıyla gelen 5 odası allotment oda

❌ YANLIŞ:
- 5 ayrı Normal Reservation
- Her biri Booking.com Channel
- Her biri 500 TL (normal tarife)
- Commission: -75 TL (Booking %15)
→ Sonuç: Booking 75 TL komisyon alır, oysa allotment malı 200 TL'de verilmişti

✅ DOĞRU:
- 5 Reservation, Hepsi "Allotment" olarak işaretlenir
- Kontrat Adı: "Booking Allotment Q2 2026"
- Kontrat Fiyatı: 200 TL/gece
- Commission: 0 TL (Kontrat zaten muhasebeleştirildi)
- System Flag: "BOOKED_FROM_ALLOTMENT"

NOT: "Kontrat Kalıntı" raporu haftalık çalıştırılmalı
(Allotment: 5 oda, 2 gece kullanıldı, 3 gece kaldı)
```

**Elektra/Sedna/Veboni Kontrat Tabloları:**

| Sistem | Tablo | Key Field | Action |
|--------|-------|-----------|--------|
| **Elektra** | CONTRAT | CONT_ID, ROOM_TYPE | Reservation oluştururken CONT_ID link |
| **Sedna** | ALLOTMENT_CONTRACT | ALLOT_ID, HOTEL_ID | SELECT * WHERE REMAINING > 0 |
| **Veboni** | ORACLE RATE_CODE | RC_CODE | INSERT rate_code='BOOKING_ALLOT' |

---

### 🔴 HATA 5: Eksik Bilgi ile Açıp Sonradan Değiştirilmesi

**Sorun:** Acente, tur operatörü veya misafir "detayları sonra gönderirim" diyerek eksik rezervasyon açılır, ardından ertesi gün masif değişiklikler yapılır.

**Sonuçlar:**
- **Check-in Kaos:** Resepsiyon oda tahsisini yanlış yapmış olabilir
- **Tarih Değişimi:** 2 gece olan oda sonradan 5 gece olursa, arası boş kalmışsa rebooking gerekir
- **Price Variance:** Tutar değişirse accounting reconciliation sorunu
- **Channel Sync Loss:** Booking/Airbnb otomatik update'leri başarısız olabilir

**Yasaklanması Gereken Durumlar:**

```
❌ AÇILMAMASI GEREKEN:
1. Check-in tarihi TBD (To Be Determined)
2. Oda sayısı "1-2 adet belirsiz"
3. Misafir adı "TBA" veya "GROUP" (soyadı yok)
4. Tutar "sonra belirlenecek"
5. Acente adı "Açık" veya boş
6. Kontrat/Rate Code boş bırakılması
7. Country parametresi "diğer" veya boş

✅ ÖNCESİNDE HAZIRLANMALI:
- Telefon / Email rezervasyon, check-in tarihini doğrula
- "1 saat içinde detayları gönderin" söz al
- Detaylar gelmeden sistem kaydını açmayın
- Eğer açmak mecbursa: "PENDING" durumunu işaretle, ertesi sabah kontrol et
```

**Değişiklik Protokolü (Zorunlu Olursa):**

```
Adım 1: Değişiklik Kaydını Aç
  - "Reservation Amendments" loguna gir
  - Orijinal detaylar ve Yeni detayları not et
  - Değişiklik nedeni: "Acente Confirmation"

Adım 2: Oda Tahsisini Kontrol Et
  - Oda kullanılmış mı? (Check-in yaptı mı?)
  - Evet → Rebooking gerekli, accounting onayı şart
  - Hayır → Direkt değiştir

Adım 3: Pricing Reconcile
  - Eski tutarla, Yeni tutar farkını accounting'e bildir
  - Booking/OTA commission yeniden hesapla
  - Difference journal'a kaydet

Adım 4: Channel Sync Check
  - Booking.com / GDS güncelledimi?
  - Manual sync gerekirse: Admin → "Force Sync to Channels"
```

---

### 🔴 HATA 6: Yanlış Acente/OTA Seçimi

**Sorun:** Telefon veya email ile gelen rezervasyon hangi acente kaynağından geldiği bilinmemekte, sistem rastgele bir acente seçilir veya "Direct" ile girilir.

**Sonuçlar:**
- **Commission Yanılışlığı:** Acente %10 indirim vermişse, sistem %15 (Booking) hesaplar
- **Acente Reconciliation:** Ay sonu, acente "ödeme bekledim, siz hatalı kayıt yaptınız" der
- **Payment Routing:** Ödeme yanlış acente/channel'a kaydedilir
- **Channel Conflict:** Same reservation, çoklu channel'da duplicate olarak görülür

**Acente Tanımlaması Tablosu:**

```
Telefon Örneği:
Arayan: "Merhaba, ben Bursa Turizm'den, 5 oda istiyorum"

✅ DOĞRU SORGULAMA:
1. "Sizin acente kodu nedir?" → "001"
2. "Bu tur nereden satılıyor?" → "Booking.com aracılığıyla mı, doğrudan mı?"
3. "Referans numaranız?" → "KON-2026-001"
4. "Sizi kim tavsiye etti?" → Kontrat kaydını aç

❌ YANLIŞ VARSAYIM:
- "Bilmiyoruz, Direct olarak gir"
- "Booking'ten gibi görünüyor, ama emin değiliz"
```

**Channel/Acente Mapping Tablosu:**

| Arayan | Sistem Kaydı | Commission | Rate Code |
|--------|--------------|-----------|-----------|
| Booking Partner | Booking.com | 15% | BOOKING_STD |
| Telefon + Acente Adı | AcenteAdi_Phone | İşleme göre | ACT_PHONE |
| Email + Referral Link | Web_Campaign_XYZ | 0% | WEB_DIRECT |
| GDS (Sabre) | GDS_SABRE | 10% | GDS_COMM |
| Walk-in + Misafir | Direct_WalkIn | 0% | DIRECT |
| Reciprocal Otel | Hotel_Name_Recip | 0% | RECIPROCAL |

**Yanlış Acente Seçimi Düzeltme:**

```
İşlem: Otel + Accounting onayı gerekli

1. Booking.com'da göster ("Bu ID'li rez kaydınızı görebiliyor musunuz?")
2. Doğru acente/channel belirle
3. Sistem kaydında değiştir: Admin → Reservation → Edit → Channel/Acente
4. Commission yeniden hesapla ve adjustment journal'a kaydet
5. Accounting'e: "Acente Reconciliation Adjustment - Rez #XYZ"
```

---

### 🔴 HATA 7: Yanlış Ülke Seçimi

**Sorun:** Rezervasyon ülke (Country) parametresi, misafirin milliyeti, acente menşei, kanal ve kontrat şartlarıyla uyumsuz seçilir.

**Sonuçlar:**
- **Vergi Hesaplaması:** Ülkeye göre KDV oranı değişir (Türkiye %10, AB %21-27, Mısır %14), yanlış vergi uygulanır
- **Commission Rate:** İngiliz acente ≠ Türk acente commission yapısı
- **Currency Issues:** Multi-currency sistem varsa, döviz kuru hatalı uygulanır
- **Reporting Segregation:** "Market by Country" raporu çöker

**Ülke Seçim Kuralları:**

```
KURAL 1: OTA Rezervasyonu
- Booking.com'dan → Country = Booking'in belirlediği ülke (otomatik)
- Airbnb'den → Country = Airbnb'nin belirlediği ülke (otomatik)
- Sisteme elle giriş durumunda → Booking'te misafir ülkesini kontrol et

KURAL 2: Acente Telefon Rezervasyonu
- Acente'nin bulunduğu ülke ≠ Misafir ülkesi
- Tercih: Misafir ülkesi VEYA Acente ülkesi (otel politikasına göre)
- NOT AL: "ABC Turizm (Türkiye) Almanya'dan 5 misafir gönderiyor"
  → Country = Germany (misafir) OR Turkey (acente) ?
  → Otel muhasebesi belirlemeli

KURAL 3: Direct Website Rezervasyonu
- Website'de language/country selector var mı?
- Varsa → Selected country seç
- Yoksa → Misafir IP adres ülkesi VEYA email domaininin ülkesi

KURAL 4: Corporate/Group Reservasyonu
- Şirketin merkez ülkesi DEĞİL
- Şirket çalışanlarının çoğunluğunun ülkesi

KURAL 5: Walk-in
- Misafir ID/Pasaport ülkesi
- Eğer yabancı misafir → Pasaport ülkesi
```

**Country Dropdown Saçma Seçimlerinden Kaçın:**

```
❌ YANLIŞ:
- Country = "Europe" (bölge, ülke değil)
- Country = "Unknown" (tespit etmeden giriş)
- Country = "Null" (boş)
- Country = "Germany" (ama misafir Türkiye'de kalıyor)

✅ DOĞRU:
- Country = "Germany" (misafir milliyeti)
- Country = "Turkey" (acente ülkesi, misafir milliyeti belgesi yok)
- Country = "Italy" (EU booking'ten)
- Country = "Mixed" (Grup 3 ülkeden)  ← Sadece grup
```

**Vergi Hesaplaması Etkisi:**

| Country | KDV Oranı | Commission Yapısı | Currency |
|---------|-----------|-------------------|----------|
| Turkey | 10% + Conv. Tax 2% | Net tutardan | TRY |
| Germany | 19% | Gross tutardan | EUR |
| Italy | 10% | Gross tutardan | EUR |
| Egypt | 14% + Sales Tax | Net tutardan | EGP |
| Greece | 6% | Gross tutardan | EUR |

---

### 🔴 HATA 8: Yanlış Oda Tipi ve Bed Type Seçimi

**Sorun:** Misafir isteği "Twin Bed" ama sistem "Double Bed" ile girilir; veya Oda kapasitesi "2 Kişi" olması gerekiyorken "4 Kişi" kaydedilir.

**Sonuçlar:**
- **Housekeeping Hazırlıkları:** Oda yanlış (ama benzer, şikayetle sonuçlanır) hazırlanır
- **Overbooking Risk:** 4-kişilik oda 2 kişiye verilirse, başka grup geldiğinde yeterli oda olmayabilir
- **Refund/Dispute:** Booking.com'da misafir "yanlış oda" ile şikayet eder
- **Accessibility Issues:** Tekerlekli sandalye uyumlu oda gerekiyorken normal oda verilir

**Oda Tipi Standardizasyonu:**

```
STANDART ODA TİPLERİ (PPG Örneği):

Kategori: ROOM_TYPE_ID
- STD (Standard): 1 Double Bed, 1-2 kişi
- DBL (Deluxe): 1 King Bed, 2 kişi
- TWN (Twin): 2 Single Bed, 2 kişi
- FAM (Family): 2 Double Bed + Sofa, 3-4 kişi
- SUI (Suite): Separate Living, 2-4 kişi
- ACC (Accessible): Tekerlekli Sandalye uyumlu

BED COMPOSITION:
- 1DB (1 Double Bed)
- 1KB (1 King Bed)
- 2SB (2 Single Bed)
- 1DB+1SB (1 Double + 1 Single)
- 2DB (2 Double Bed)

Girilirken: ROOM_TYPE + BED_COMPOSITION SEÇİLMELİ
```

**Doğru Giriş Örneği:**

```
Misafir Talebi: "2 kişi, ayrı yataklar istiyorum"

❌ YANLIŞ:
- Room Type: Standard (Default seçildi)
- Bed: Double (Default seçildi)
→ Sonuç: Double yatakta rezarvasyon, misafir ayrı yatak ister

✅ DOĞRU:
- Room Type: Twin
- Bed: 2 Single Bed
- Guest Count: 2
- Note: "Twin bed talep, teyit edin"
```

---

### 🔴 HATA 9: Meal Plan / Pansiyon Türü Yanlışlığı

**Sorun:** Reservation, "All Inclusive" fiyat ile girilir ama sistem "Room Only" olarak kaydedilir veya tersi.

**Sonuçlar:**
- **Revenue Accounting:** Yemek hizmetinin fiyatlandırması accounting'de iyice karışır (yemek geliri ayrı hesap gerekebilir)
- **Pricing Verification:** Booking'te fiyat "500 TL (All Inclusive)" yazıyorsa, sistem de aynısı olması lazım
- **Housekeeping & F&B:** Sabah kahvaltısını bilmeyen bir otel, tüm misafirler için hazır olmamış olur
- **Margin Calculation:** Room revenue vs Food revenue ayrı analiz yapılamaz

**Pansiyon Türleri:**

| Kod | Tanım | Fiyat Modeli | F&B Sorumluluğu |
|-----|-------|--------------|-----------------|
| **RO** | Room Only | Sadece oda | Yok |
| **BB** | Bed & Breakfast | Oda + Sabah kahv. | 1 öğün |
| **HB** | Half Board | Oda + Sabah + Akşam | 2 öğün |
| **FB** | Full Board | Oda + 3 öğün | 3 öğün |
| **AI** | All Inclusive | Oda + Tüm yemekler + içkiler | 4+ |
| **UAL** | Ultra All Inclusive | AI + Premium extras | 4+ |

**Doğru Giriş:**

```
Örnek: Booking.com Listesi "All Inclusive 500 TL" ile 2 gece

Gidiş:
1. Booking'te Meal Plan kontrol: "All Inclusive" ✓
2. PPG Reservation oluştur
3. Meal Plan: "AI" (All Inclusive) seç
4. Tutar: 500 TL / gece = 1.000 TL toplam
5. Field olarak: meal_plan_code = 'AI', meal_plan_price_included = true

Kontrol:
- Revenue Report'ta: room_revenue = 1.000 TL, food_revenue = included
- Booking.com Channel kontrol: Meal plan sync'lenmiş mi?
```

---

### 🔴 HATA 10: CVC/Güvenlik Deposu (Security Deposit) Hatasız Belgelenmemesi

**Sorun:** Misafir kredi kartından deposit alındı ama sistem kaydında, note'inde veya dokümantasyonunda belirtilmez.

**Sonuçlar:**
- **Check-out Kaos:** Resepsiyon "deposit hangi karttan alındı?" bulmak zorunda kalır
- **Dispute Risk:** Misafir "niye kartımdan para çekildi?" diye şikayet eder
- **Reconciliation:** Accounting'de "unallocated charge" olarak kalır
- **Chargeback:** Visa/Mastercard chargeback başlamamadan geri iadesi gerekir

**Doğru Prosedür:**

```
Deposit Alırken:
1. Sistem Notu: "Security Deposit - Card: XXXX-XXXX-XXXX-4242, $200, Auth Code: #ABC123"
2. Tutar: Ayrı field'da "SECURITY_DEPOSIT" = 200 USD
3. Expiration: Çoğu ülkede 14 gün sonra iptal edilmeli
4. Authorization: Guest imza veya email confirmation alınmalı

Check-out'ta:
- Oda hasar yoksa: Deposit otomatik iptal
- Oda hasarlı: Deposit'ten kesti, kalanı iade

Elektra/Sedna/Veboni'de:
- DEPOSIT_ID ve RELEASE_DATE field'ları var mı, kontrol et
- Check-out flow'unun "Release deposit?" adımı var mı?
```

---

## 4. PMS-ÖZEL UYGULAMALAR

### 4.1 ELEKTRA Özellikleri

**Avantajlar:**
- Group Reservation mode'u vardır (toplu kayıtlar için ideal)
- Rate Code (kontrat) integration çok iyi
- Multi-language support

**Dikkat Edilmesi Gerekenler:**

```sql
-- Elektra'da Kontrat Kaydı:
INSERT INTO CONTRAT (CONT_ID, HOTEL_ID, CONT_TYPE, RATE_CODE, ADR, ACTIVE)
VALUES (1, 1, 'ALLOTMENT', 'BOOKING_ALO_Q2', 200.00, 1);

-- Reservation'da kontrat linklemek:
UPDATE RESERVATION SET CONT_ID = 1, RATE_CODE = 'BOOKING_ALO_Q2' 
WHERE RES_ID = 12345;

-- Grouping (Toplu Rez):
INSERT INTO GROUP_RESERVATION (GRP_ID, GROUP_NAME, CONTACT_NAME, CONTACT_PHONE)
VALUES (1, 'ABC Turizm - Mai Grubu', 'Ahmet Yilmaz', '+90212XXXXXXX');

INSERT INTO RESERVATION (RES_ID, GRP_ID, ROOM_NUM, CHECK_IN, CHECK_OUT)
VALUES (101, 1, 101, '2026-05-15', '2026-05-22'),
       (102, 1, 102, '2026-05-15', '2026-05-22'),
       ...
```

**Elektra Yaygın Hatası:** `GROUP_ID = NULL` bırakılırsa, sistem grup'u tanımaz, her oda ayrı hesaplanır.

---

### 4.2 SEDNA Özellikleri

**Avantajlar:**
- Allotment tracking çok detaylı
- Daily inventory synchronization
- Strong billing integration

**Dikkat Edilmesi Gerekenler:**

```sql
-- Sedna'da Allotment'ı Kontrol:
SELECT ALLOT_ID, ROOM_TYPE, ORIGINAL_QTY, BOOKED_QTY, REMAINING_QTY
FROM ALLOTMENT_CONTRACT
WHERE HOTEL_ID = 1 AND CHECK_IN = '2026-05-15';

-- Remaining = 0 ise, sistem başka rez kabul etmez
-- YANLIŞ: BOOKED_QTY'yi elle değiştirmek

-- Doğru: Reservation oluştur, sistem otomatik BOOKED_QTY artır
INSERT INTO ROOM_RESERVATION (RESV_ID, ALLOT_ID, ROOM_NUM, GUEST_NAME)
VALUES (1001, 1, 101, 'John Doe');

-- Sedna otomatik olarak allotment'ı updated:
-- ALLOTMENT_CONTRACT.BOOKED_QTY += 1
-- ALLOTMENT_CONTRACT.REMAINING_QTY -= 1
```

**Sedna Yaygın Hatası:** `REMAINING_QTY = -5` (oversold duruma) ve accounting "hangi 5 misafir?" bulmak zorunda kalır.

---

### 4.3 VEBONI (Oracle) Özellikleri

**Avantajlar:**
- Enterprise Oracle altyapısı
- Role-based access control
- Audit trail built-in

**Dikkat Edilmesi Gerekenler:**

```sql
-- Veboni'de Res Statü Kontrol:
SELECT RES_ID, GUEST_NAME, CHECK_IN, STATUS, RATE_CODE
FROM RESERVATION
WHERE HOTEL_ID = 1 AND CHECK_IN = '2026-05-15';

-- STATUS Tipleri: 'CONF' (Confirmed), 'CANC' (Cancelled), 'CHK' (Checked In), 'CHO' (Checked Out)
-- Yanlış: STATUS = 'PENDING' ve unutmak (ertesi gün kontrol edilmez)

-- Veboni'de Rate Code'a Göre Vergi Calc:
SELECT RC_CODE, RC_DESC, TAX_RATE, INCLUDE_TAX_IN_RATE
FROM RATE_CODE
WHERE HOTEL_ID = 1;

-- Eğer RC_CODE = 'HOUSE_USE' ise, vergi = 0 (doğru yapılandırılmışsa)
-- YANLIŞ: House Use için vergi hesaplanması
```

**Veboni Yaygın Hatası:** `RATE_CODE = 'AUTO'` (default) kullanılırsa, sistem yanlış kontrat fiyatını apply edebilir.

---

## 5. REZERVASYON GİRİŞ AKIŞI (STEP-BY-STEP)

### 5.1 Pre-Giriş Aşaması (Reservation Kaynağı Belirlenirken)

```
STEP 1: Bilgi Toplaması
├─ Kanal: Booking / Telefon / Walk-in / Acente?
├─ Misafir Adı: Ad Soyad (tam, doğru yazım)
├─ Check-in & Check-out: Kesin tarihleri doğrula (SMS/Email ile teyit)
├─ Oda Sayısı & Tipi: "2 Twin Room" veya "1 Standard Double"?
├─ Misafir Sayısı: Yetişkin/Çocuk/Bebek breakdown
├─ Özel İstekler: Hava Manzarası, Balkon, Mobility Issue, etc.
└─ Tutar & Ödeme: Net tutarı, commission, vergiler

STEP 2: Sistem Uyumluluğu Kontrolü
├─ Bu tarihte yeterli oda var mı?
├─ Acente kontrat limitleri geçilmedi mi?
├─ Rate code sisteme defined mi?
└─ Country/Currency compatibility var mı?

STEP 3: Red Flag Kontrol
├─ Group mi? Evet → Grup modunu aç
├─ House Use / Complementary mi? Evet → Special category seç
├─ Kontrat odası mı? Evet → Kontrat linkle
├─ Ücretsiz mi? Evet → Authorization al
└─ High-value rez mi? Evet → Manager approval al
```

### 5.2 Sistem Giriş Aşaması

```
PPG / PMS Açılır:

1. Yeni Reservation Kaydı Oluştur
   │
   ├─ GUEST INFORMATION
   │  ├─ Full Name: [Ad Soyad] ← Full Legal Name
   │  ├─ Email: [Email] ← Confirmation gönderilecek
   │  ├─ Phone: [Telefon] ← Urgent contact
   │  ├─ Nationality: [Ülke] ← Passport/ID'den
   │  └─ ID Number: [Pasaport/Kimlik No]
   │
   ├─ ROOM & DATES
   │  ├─ Check-in: [Tarih] ← Doğrulandı
   │  ├─ Check-out: [Tarih] ← Doğrulandı
   │  ├─ Room Type: [Twin/Double/Suite] ← Guest istemi
   │  ├─ Room Number: [Auto] VEYA [Manual Select]
   │  ├─ Bed Type: [1 Double / 2 Single / King]
   │  └─ Occupancy: [2 Adults, 0 Children, 0 Infants]
   │
   ├─ CHANNEL & RATE
   │  ├─ Channel: [Booking.com / Direct / ACT Phone / GDS / Walk-in]
   │  ├─ Market/Country: [Germany / Turkey / Egypt]
   │  ├─ Rate Code: [BOOKING_STD / CORP_XYZ / HOUSE_USE / FREE]
   │  ├─ Daily Rate: [500 TL/gece] ← Doğrulanan tutar
   │  ├─ Number of Nights: [3] ← Otomatik calc
   │  └─ Total Revenue: [1.500 TL]
   │
   ├─ EXTRAS
   │  ├─ Meal Plan: [All Inclusive / Half Board / Room Only]
   │  ├─ Currency: [TRY / EUR / USD]
   │  ├─ Special Requests: [Balkon Tercih, Erken Check-in vb]
   │  └─ Notes: [Booking Ref: BXY12345, Companion details, etc.]
   │
   └─ SUBMIT
      ├─ System Validation:
      │  ├─ ✅ Double-Booking Check (aynı oda, aynı tarih?)
      │  ├─ ✅ Rate Code Validity (valid mi?)
      │  ├─ ✅ Guest Name Check (boş mu?)
      │  └─ ✅ Financial Consistency (tutar ≥ 0?)
      │
      └─ Reservation Created: Confirmation # ABC123
```

### 5.3 Post-Giriş Aşaması

```
STEP 1: Channel Sync Kontrolü
├─ Booking.com? → Platform update status'ini kontrol (✅ Confirmed)
├─ OTA? → Sync logs'a bakın (successful sync mi?)
├─ GDS? → PNR update'i?
└─ Direct? → Misafir email confirmation gitti mi?

STEP 2: Allotment/Kontrat Update
├─ Kontrat odası girildi mi? → Remaining quantity düştü mü?
├─ Group rez mi? → Tüm 10 oda girildi mi?
└─ Allotment? → Acente quota updated mi?

STEP 3: Documentation
├─ Reservation file'ında note: "Booking Ref: #BXY12345, Market=Germany"
├─ Özel istekler: "Early check-in 14:00 istedi, availability kontrol et"
├─ Financial: "Commission = 75 TL (Booking %15)"
└─ Status: "CONFIRMED" (PENDING değil!)

STEP 4: Housekeeping & Front Desk Alert
├─ Oda hazırlanması için listede mi?
├─ Special requests (balkon, twin, hava manzarası) marked mi?
└─ Check-in notification sent mi?
```

---

## 6. HATA DÜZELTİM PROSEDÜRÜ

### Eğer Hata Yaptıysanız: Acil Düzeltme Yönleri

#### Durumu 1: Oda Sayısını Yanlış Girdiniz (3 oda yerine 1 oda)

```
❌ YANLIŞ DURUM:
- Reservation ID: #123456
- 1 oda, 10 gece
- Tutar: 5.000 TL (hepsi 1 odaya)

✅ DÜZELTME ADIMı:

1. Mevcut Rez'i CANCEL et (veya VOID et)
   - Admin Panel → Reservation #123456
   - Action: "VOID" (Money not charged yet) VEYA "CANCEL" (Money returned)

2. Yeni Rez oluştur (Doğru):
   - 3 ayrı Reservation VEYA Grup Mode
   - Her oda: 10 gece, 1.666,67 TL (5.000/3)
   - Channel: Aynısı kalsın
   - Rate Code: Aynısı kalsın

3. Kontrol:
   - Total Revenue stil 5.000 TL? ✓
   - Occupancy: 3 oda sayılıyor mu? ✓
   - ADR: 1.666,67 / gece ? ✓

4. Acente/Booking bilgilendir:
   - "Rez hatası düzeltildi, yeni ID: #123457-59"
```

#### Durumu 2: Kontrat Kaynağını Yanlış Girdiniz

```
❌ YANLIŞ:
- Booking allotment odası
- Sistem kaydında: Channel = "Direct", Rate Code = "STD"
- Commission: -75 TL (Booking %15) ekstra

✅ DÜZELTME:

1. Reservation Edit (veya düzelt, cancel etme)
   - Channel: "Booking.com" ← DOĞRU
   - Rate Code: "BOOKING_ALLOT_Q2" ← DOĞRU
   - Commission: 0 TL (Kontrat zaten muhasebeleştirildi) ← DOĞRU

2. Accounting Adjustment:
   - Journal: "Acente Reconciliation - Rez #123456 Düzeltme"
   - Debit: Commission Expense (75 TL) [eğer çıkarılmışsa]
   - Credit: Booking.com Payable (75 TL)

3. Booking.com Tarafından:
   - Rez'i kontrol et, channel sync doğru mu?
   - Eğer sistem hala "Direct" gösteriyorsa, manual override yapabilir misiniz?
```

#### Durumu 3: Datesini Yanlış Girdiniz (15-20 Mayıs yerine 15-20 Haziran)

```
❌ YANLIŞ:
- Check-in: 15 Haziran
- Check-out: 20 Haziran
- OTA'da: 15 Mayıs - 20 Mayıs yazıyor

✅ DÜZELTME:

1. ACIL: Check-in tarihine kadar yapmazsanız, sorun yok
   - Sistem: Edit Reservation → Check-in Date = 15 Mayıs
   - 1 tıkla düzeltilir

2. Check-in SONRASI yapılmışsa:
   - Misafir bilgilendir: "Tarih hatasını fark ettik, sizi 15 Mayıs'ta değil 15 Haziran'da bekliyoruz"
   - Eğer misafir 15 Mayıs'ta şimdi başka yerde kalmışsa → Dispute risk
   - Booking.com'da issue açılırsa → otel konaklamayı fulfill etmese bile, para iade edilebilir

3. Correct yapılırsa:
   - Rez edit et (Check-in = 15 Mayıs)
   - Occupancy raporları otomatik güncellenir
   - Acente/OTA channel sync (eğer double entry yoksa) çalışır
```

#### Durumu 4: House Use/Complementary Karıştırdınız

```
❌ YANLIŞ:
- Complementary oda (müdürün akrabası, 0 TL)
- Sistem kaydında: House Use (vergi hesaplandı, 0 TL)

✅ DÜZELTME:

1. Geri Kontrol: Niyeti belirle
   - Müdür: "Bu misafir ücret değil, şirket tarafından cezalandırılan müşteri tazminatı için ücretsiz"
   → Complementary olmalı

2. Sistem düzelt:
   - Reservation Category: "COMPLEMENTARY" ← seç
   - Rate Code: "COMPLIMENTARY" ← seç
   - Tutar: 0 TL
   - Vergi: 0 TL
   - Note: "Müşteri Tazminatı - 2026-06-16"

3. Accounting Onay:
   - Muhasebe: "Bu complementary oda vergisiz mi, vergilenmeli mi?"
   - (Ülkeye ve şirket politikasına göre değişir)
```

#### Durumu 5: Acente Yanlış Seçildi (Direct yerine Booking)

```
❌ YANLIŞ:
- Telefon rez: "Booking aracılığından, 5 oda, Booking Ref: BXY12345"
- Sistem: Channel = Direct, Commission = 0

✅ DÜZELTME:

1. Channel Change:
   - Admin → Reservation Edit
   - Channel: "Booking.com" ← DOĞRU
   - Commission %: 15% ← DOĞRU

2. Commission Yeniden Calc:
   - Total Revenue: 5.000 TL
   - Commission: 750 TL (5.000 × 15%)
   - Net Received: 4.250 TL

3. Accounting:
   - Journal: "Channel Correction - Booking Commission Accrual"
   - Credit: Booking.com Payable (750 TL)
   - Debit: Commission Expense (750 TL)

4. Booking ile Doğrula:
   - Booking ID'si ile rez'i Booking.com panelinde kaç TL gösteriyor?
   - Sisteminizde kaç TL gösteriyor?
   - Match ediyor mu?
```

---

## 7. EN İYİ UYGULAMALAR (BEST PRACTICES)

### 7.1 Günlük Check-List

```
HER SABAH, VERİ GİRİŞ STAFFı:

[ ] Pending Reservations Kontrolü
    - "PENDING" durumundaki rez var mı? (Dün açılmış)
    - Detayları tamamlandı mı?
    - Eğer hayır → Acente/Misafir kontrol et

[ ] Channel Sync Logs
    - Booking.com / OTA sync başarılı mı?
    - Failed entries var mı?
    - Error logs'ta red flag?

[ ] Allotment Inventory
    - Kontrat allotment'ları eksik mi?
    - "Remaining = 0" iken yeni rez kabul ediliyor mu?
    - Alert gerekirse acente'ye bildir

[ ] Commission Reconciliation
    - Dün girilen rezlerin commission'ları hesaplandı mı?
    - House Use / Complementary sıfır commission mi?

[ ] Special Requests
    - Balkon, twin, erken check-in talepleri marked mi?
    - Housekeeping'e haber verildi mi?

[ ] High-Value Reservations
    - 5.000 TL+ rez var mı?
    - Manager approval alındı mı?
```

### 7.2 Haftasonu Kontroller

```
CUMARTESİ AKŞAMI (haftaya hazırlanmak için):

1. ADR Variance Analizi
   - Hafta ortalaması vs Plan
   - Anomali (çok yüksek/düşük) var mı?
   - → Yanlış fiyatlandırma tespiti

2. Group Booking Review
   - Grup konaklamalarında hepsi confirmed mi?
   - Check-in/Check-out zamanlarında crew'nin hazırlanması yeterli mi?

3. Allotment Burn Rate
   - Kontrat odaları zamanında tükenecek mi?
   - Ek allotment gerekirse, acente'ye sor

4. Accounting Reconciliation
   - Hafta içi reservation tutar + commission = Banking'te para geldi mi?
   - Farklılık var mı?
```

### 7.3 Aylık Denetim

```
AY SONU (Financial Close öncesi):

1. Complete Reservation Audit
   - Tüm rez'ler "CONFIRMED" veya "CHECKED OUT" mi?
   - "PENDING" kalanlar var mı? (Neden?)
   - "CANCELLED" rez'leri revie et (iptal nedeni valid mi?)

2. Commission & OTA Reconciliation
   - Booking.com'daki para = PPG sistemi?
   - Airbnb settlement'ı match ediyor mu?
   - Acente commissions paid?

3. Contractual Compliance
   - Acente / Tour Operator kontratları
   - Pricing: Agreed rate vs Actual rate match mi?
   - Allotment usage: Plan vs Actual
   - Commission: Paid on time mi?

4. Country/Market Breakdown
   - Country by Revenue (plan vs actual)
   - Market mix uygun mu?
   - Anomali: Tek bir ülkeden %80 rez (concentration risk)?

5. Error Log Review
   - System errors kaydedildi mi?
   - "Wrong room type given" dispute'ler?
   - "Double bookings" prevented mi?
```

---

## 8. SÜRÜM NOTLARI VE YASAL UYARILAR

### Yasal Uyarılar
- **Ayrımcılık Yasağı:** Country, Nationality, Religion bazında hiçbir rezervasyon reddedilmemelidir
- **GDPR / Veri Gizliliği:** Misafir bilgileri (adı, pasaport, email, telefon) güvenli tutulmalı, izinsiz üçüncü tarafa verilmemelidir
- **Vergi Uyumluluğu:** Her ülkenin KDV, turizmvergi vb kurallarına uygun giriş yapılmalı
- **Iade Politikası:** Reservation iptal edilirse, otel iade politikasına göre geri ödeme yapılmalı

### PMS Güncellemeleri
- **2026 Q3:** Elektra 5.2 → Yeni "Smart Allotment" feature (auto-adjust untuk)
- **2026 Q4:** Sedna Oracle upgrade (performans %40 artacak)
- **2027 Q1:** Veboni multi-currency improvements

---

## 9. DESTEK VE RAPORLAMA

### Hata Bulunursa:
1. **Admin Panel** → Reservation #XYZ → "Report Issue"
2. **PPG Support Slack:** #pms-data-quality → Screenshot + Durum
3. **Escalation:** Admin → Finance → Otel Müdürü (tutarsa)

### Aylık Rapor:
```
PMS Data Quality Report - Haziran 2026

Toplam Rez: 1.250
- Doğru Girişler: 1.225 (98%)
- Kontrat Errors: 15 (1.2%)
- Channel Mismatches: 10 (0.8%)

Yaygın Hatalar:
1. Group Booking wrong room count: 8
2. House Use tax mismatch: 4
3. Commission calculation delay: 3
```

---

## KAYNAKÇA

- Elektra API Documentation: `/docs/elektra-api`
- Sedna Schema Specs: `/docs/sedna-schema`
- Veboni Oracle Manual: `/docs/veboni-oracle`
- PPG PMS Talimatnamesi: `pms.pmapartner.com/docs`

---

**Dokuman Hazırlanmış:** 2026-06-16  
**Sorumlu:** PMS Veri Yönetimi Ekibi  
**Son Güncelleme:** Version 1.0  
**Dağıtım:** PPG Staff, Acente Eğitim Programı
