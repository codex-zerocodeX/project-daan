# Philippine commuter transport cost, inflation, toll, and speed baseline

> **Historical naming note.** This July 2026 record uses **Project Daan**, the internal codename at the time. The current product and codebase name is **Alitaptap**.

Research cutoff: **July 18, 2026 (Asia/Manila)**

This document is the evidence baseline for commuter cost in Project Daan. It covers national public-utility-vehicle fare, selected local tricycle fare, active Metro Manila rail fare, representative toll-gate charge, transport inflation, and legal road-speed limits. It is not a live fare calculator: a posted fare matrix, station matrix, LGU ordinance, operator quote, or toll-plaza display can be more specific and more recent.

## Executive finding

- The default national road-PUV fare still comes from the LTFRB matrices effective in **2022–2024**, because the broad fare increase announced on March 17, 2026 was **suspended on March 18, 2026**. A proposal or approved-but-suspended rate is not a current fare.
- There is no single “standard peso per kilometer” across commuter transport. Jeepney and city-bus fare combine a minimum distance with an add-on rate; provincial bus and UV Express are distance-based; taxi and TNVS add time and, for TNVS, dynamic components; tricycle fare is set locally; rail uses station-to-station matrices; toll depends on gate pair and vehicle class.
- There is also no single “standard km/h” operating speed. A **fare rate in PHP/km**, a **legal maximum in km/h**, and an **observed average speed in km/h** are different measures. RA 4136 supplies default maximum limits when a more specific signed or lawful route rule does not control.
- June 2026 national **transport CPI was 12.8% higher year on year**, twice the 6.4% all-item headline rate. For the bottom 30% of households, transport inflation was **15.6%**. Transport CPI is broader than passenger fare: it also captures fuel, vehicle, maintenance, and toll-related price movement.
- Toll is normally charged to the vehicle/operator, not as a separate regulated passenger fare. It can still affect a commuter through route price, operator cost, P2P or van quotation, or a TNVS/taxi trip, but it must not be presented as a universal per-passenger surcharge.

## Status rule

Every price below has one of six meanings:

| Status | Meaning |
|---|---|
| `effective` | Source states the rate is in force and no later superseding source was found by the cutoff |
| `temporary` | Time-bounded discount, subsidy, or special implementation; show its start and known end separately |
| `program_active` | Program is currently offered but the reviewed source gives no fixed end; recheck before use |
| `approved` | Regulator approved or announced an amount, but it is not yet an effective commuter charge |
| `suspended` | Approved or announced but explicitly deferred; do not use as current default |
| `local_sample` | Valid only for the named LGU, route, operator, or gate pair; not nationally generalizable |

## National road-PUV fare

The LTFRB [fare-rate index](https://ltfrb.gov.ph/fare-rates/) labels its linked guides “as of October 2024.” The current baseline below uses those official guides, checked against the March 2026 suspension.

### Fixed-route and metered mode

| Mode | Effective regular fare | Priority fare | Source status |
|---|---:|---:|---|
| Traditional PUJ | PHP 13.00 for first 4 km + PHP 1.80/succeeding km | PHP 10.40 base + PHP 1.44/km; guide rounds to nearest PHP 0.25 | `effective` from Oct. 8, 2023; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/Fare-Guide_Traditional-PUJ-Provisional-Fare-Increase_08Oct2023.pdf) |
| Modern/electric PUJ, non-air-conditioned | PHP 15.00 for first 4 km + PHP 1.80/succeeding km | PHP 12.00 + PHP 1.44/km | `effective` from Oct. 8, 2023; [LTFRB guide](https://www.ltfrb.gov.ph/wp-content/uploads/2024/11/Fare-Guide_Modernized-Non-Aircon-Provisional-Fare-Increase_08Oct2023.pdf) |
| Modern/electric PUJ, air-conditioned | PHP 15.00 for first 4 km + PHP 2.20/succeeding km | PHP 12.00 + PHP 1.76/km | `effective` from Oct. 8, 2023; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/Fare-Guide_Modernized-Aircon-Provisional-Fare-Increase_08Oct2023.pdf) |
| City bus, ordinary | PHP 13.00 for first 5 km + PHP 2.25/succeeding km | 20% discount | `effective` from Oct. 3, 2022; linked by [LTFRB index](https://ltfrb.gov.ph/fare-rates/) |
| City bus, air-conditioned | PHP 15.00 for first 5 km + PHP 2.65/succeeding km | PHP 12.00 + PHP 2.12/km | `effective` from Oct. 3, 2022; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/PUB-City-Aircon.pdf) |
| Provincial bus, ordinary | PHP 11.00 for first 5 km + PHP 1.90/succeeding km | PHP 8.80 + PHP 1.52/km | `effective` from Oct. 3, 2022; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/PUB-Provincial-Ordinary.pdf) |
| Provincial bus, regular air-conditioned | PHP 2.10/km | PHP 1.68/km | `effective` from Oct. 3, 2022; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/PUB-Provincial-Aircon.pdf) |
| Provincial bus, deluxe | PHP 2.25/km | PHP 1.80/km | `effective` from Oct. 3, 2022; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/PUB-Provincial-Deluxe.pdf) |
| Provincial bus, super deluxe | PHP 2.35/km | 20% discount | `effective` from Oct. 3, 2022; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/PUB-Provincial-Super-Deluxe.pdf) |
| Provincial bus, luxury | PHP 2.90/km | 20% discount | `effective` from Oct. 3, 2022; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/PUB-Provincial-Luxury.pdf) |
| UV Express, traditional | PHP 2.40/km | 20% discount | `effective`; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/UVE-Fare-Guide.pdf) |
| UV Express, modern | PHP 2.50/km | 20% discount | `effective`; [LTFRB guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/UVE-Fare-Guide.pdf) |
| Regular taxi, excluding airport taxi | PHP 50.00 flagdown + PHP 13.50/km + PHP 2.00/minute | 20% discount | `effective`; [LTFRB guide](https://www.ltfrb.gov.ph/wp-content/uploads/2024/11/TAXI-Fare-Rates.pdf) and [2024 order](https://ltfrb.gov.ph/wp-content/uploads/2024/10/CN-2022-7433-Taxi-Fare-Increase-03-18-2024.pdf) |

The priority column is the standard 20% fare-discount class shown in LTFRB guides for student, senior citizen, and person with disability. Eligibility and proof rules still apply. The student discount is stated as available every day in the fare guides. Actual matrix amounts are rounded to the nearest PHP 0.25, so multiplying the headline components can differ by a few centavos from the posted row.

### Worked 10 km comparison

| Mode | Unrounded formula | Posted/rounded regular fare |
|---|---:|---:|
| Traditional PUJ | 13.00 + (6 × 1.80) = 23.80 | PHP 23.75 |
| Modern PUJ, non-air-conditioned | 15.00 + (6 × 1.80) = 25.80 | PHP 25.75 |
| Modern PUJ, air-conditioned | 15.00 + (6 × 2.20) = 28.20 | PHP 28.25 |
| City bus, air-conditioned | 15.00 + (5 × 2.65) = 28.25 | PHP 28.25 |
| Provincial bus, regular air-conditioned | 10 × 2.10 = 21.00 | PHP 21.00 |
| UV Express, traditional | 10 × 2.40 = 24.00 | PHP 24.00 before any route minimum or approved matrix condition |

This comparison is useful only where a 10 km trip is actually served by the mode. It does not include transfer, waiting time, toll, booking fee, or local route exception.

### TNVS is not a single fixed fare

The pre-suspension base matrix reported by the government news service in December 2025 was:

| TNVS class | Flagdown | Distance | Time |
|---|---:|---:|---:|
| Hatchback/sub-compact | PHP 35 | PHP 13/km | PHP 2/minute |
| Sedan | PHP 45 | PHP 15/km | PHP 2/minute |
| AUV/SUV | PHP 55 | PHP 18/km | PHP 2/minute |
| Premium | PHP 145 | PHP 36/km | PHP 4/minute |

Source: [PNA explanation of LTFRB MC 2019-036 and the temporary 2025 surge rule](https://www.pna.gov.ph/articles/1265129). The December 2025 reduced-surge rule was time-bounded, so it must not be treated as the permanent July 2026 cap. The app quote remains the commuter-facing amount because booking, time, distance, applicable surge, discount, and platform implementation interact.

### March 2026 increase: approved, then suspended

On March 17, LTFRB announced higher fares for traditional and modern jeepney, city and provincial bus, P2P bus, airport taxi, and TNVS. For example, it announced PHP 14 + PHP 2.00/km for traditional jeepney and PHP 17 + PHP 2.30/km for modern jeepney. [PNA recorded the approved amounts](https://www.pna.gov.ph/articles/1271201).

On March 18, the President ordered implementation deferred. The [Presidential Communications Office suspension](https://pco.gov.ph/news_releases/pbbm-orders-fare-increase-suspension/) and [DOTr scope confirmation](https://www.pna.gov.ph/index.php/articles/1271338) cover traditional and modern jeepney, city/provincial/P2P bus, TNVS, and airport taxi. Therefore the March increase is `suspended`, not the current default in this baseline. Later petitions, including a higher jeepney request, remain proposals unless an effective LTFRB order and matrix supersede the sources above.

The April 2026 Service Contracting Program is also not a new national fare matrix. Participating routes initially focused on NCR corridors give passengers at least a 20% discount while government compensates participating operator by kilometer. Treat it as a targeted program and verify the route before promising the discount. [PCO program release](https://pco.gov.ph/news_releases/president-marcos-rolls-out-transport-subsidies-fare-discounts-to-offset-rising-fuel-costs/).

## Tricycle fare is local

Tricycle fare is not set by one national peso-per-kilometer table. The national framework devolves franchise and fare-setting functions to local government; the Quezon City Tricycle Franchising Board describes the City Council approval path, while [DILG–DOTr JMC 2017-01](https://region12.dilg.gov.ph/sites/default/files/issuances/DILG-DOTR-JMC2017-01.pdf) supplies the national regulatory framework.

| Local sample | Fare | Boundary |
|---|---:|---|
| Davao City | PHP 10 regular / PHP 8 priority for first 4 km; + PHP 1.00 / PHP 0.80 per succeeding km | Current city advisory dated June 30, 2026; [official Davao source](https://davaocity.gov.ph/transportation-planning-traffic-management/cttmo-issues-fare-matrix-for-tricycles/) |
| Quezon City | PHP 9/person regular shared trip; PHP 18 special trip; + PHP 1 each succeeding km | Ordinance SP-2757, S-2018; [official QC source](https://quezoncity.gov.ph/public-notice/an-ordinance-imposing-a-fare-increase-for-all-tricycles-for-hire-in-quezon-city-from-eight-pesos-php8-00-to-nine-pesos-php9-00-per-person-for-regular-trips-and-for-special-trips-from-sixteen-peso/). No later superseding ordinance was found in this pass, so recheck before live use. |

Project Daan must request or display the named LGU and ordinance/matrix date. It must never infer a national tricycle fare from either sample.

## Rail fare and operating status

| Line | Standard fare | Current program or status | Source |
|---|---:|---|---|
| LRT-2 | Boarding component PHP 13.29 + PHP 1.21/km; actual stored-value PHP 14–33, single-journey PHP 15–35 | Since March 23, 2026, all passengers pay 50% of standard fare automatically; no end date appears on the current page | [LRTA base adjustment](https://www.lrta.gov.ph/lrt-2-fare-adjustment/) and [current ticket page](https://www.lrta.gov.ph/tickets-and-fares/) |
| MRT-3 | Station matrix; standard PHP 13–28 | Same 50% across-the-board program from March 23, 2026, making the standard range PHP 6.50–14 before card/product conditions | [2026 MRT-3 Citizen Charter](https://www.dotrmrt3.gov.ph/dotrmrt3-citizen-charter-handbook-2026-1st-edition.pdf) and [LRTA current ticket page](https://www.lrta.gov.ph/tickets-and-fares/) |
| LRT-1 | Station matrix; April 2, 2025 adjustment approved | Not included in the March 2026 universal LRT-2/MRT-3 reduction. Eligible students, senior citizens, and PWDs have a separate 50% program. Verify eligibility and the station matrix at entry. | [DOTr rail-sector release](https://pri.dotr.gov.ph/wp-content/uploads/2025/05/Press-Riles-Insider-Volume-04-Issue-02-February-issue-v1.pdf) and [DOTr-MRT3 priority-card release](https://www.dotrmrt3.gov.ph/news/student-beep-cards-na-may-50-discount-inilunsad-ni-pbbm) |
| PNR Metro Commuter | No current NCR commuter fare | NCR operation suspended from March 28, 2024 to support NSCR construction; old PNR matrix is historical | [PNA suspension report](https://www.pna.gov.ph/articles/1220375) and [historical PNR matrix](https://pnr.gov.ph/getting-around/metro-commuter-line/20-menu-pages/142-fares-tickets-manila-tutuban-station.html) |

Do not advertise a half-price LRT-1 trip to every passenger from the LRT-2/MRT-3 program. The separate 50% priority program covers eligible students, senior citizens, and PWDs across LRT-1, LRT-2, and MRT-3; the student program is available daily and the official DOTr rail publication states it runs through 2028. [DOTr-MRT3 student release](https://www.dotrmrt3.gov.ph/news/do-tr-rolls-out-pbbm-s-50-student-discount-starting-june-20) and [DOTr rail publication](https://pri.dotr.gov.ph/wp-content/uploads/2025/08/Press-Riles-Insider-Volume-04-Issue-06-June-2025-v1.pdf). Do not present the historical PNR price as an available NCR service.

## Toll-gate cost

Toll matrices change by entry/exit pair and vehicle class. Class 1 generally covers car, SUV, jeep, and van profiles; a bus is commonly Class 2 or Class 3 depending on axle/height classification. Always confirm the operator classification. The table below is a representative audit set, not a replacement for a full gate-pair matrix.

| Expressway and route pair | Class 1 | Class 2 | Class 3 | Effective/source state |
|---|---:|---:|---:|---|
| SLEX, Alabang–Calamba | PHP 137 | PHP 274 | PHP 411 | July 1, 2026; current report of TRB second tranche, [AutoIndustriya](https://www.autoindustriya.com/auto-industry-news/trb-announces-toll-rate-hike-for-slex-star-taking-effect-july-1.html). Direct updated TRB matrix was not yet exposed in the reviewed crawl. |
| SLEX, Alabang–Sto. Tomas end to end | PHP 174 | PHP 348 | PHP 522 | July 1, 2026; [current matrix report](https://www.topgear.com.ph/news/motoring-news/slex-star-tollway-july-2026-toll-prices-a6888-20260629) |
| STAR, Sto. Tomas–Batangas City end to end | PHP 121 | PHP 242 | PHP 363 | July 1, 2026; [current matrix report](https://www.topgear.com.ph/news/motoring-news/slex-star-tollway-july-2026-toll-prices-a6888-20260629) |
| NLEX–SLEX Connector | PHP 119 | PHP 299 | PHP 418 | Oct. 15, 2024; [TRB matrix](https://trb.gov.ph/index.php/toll-rates/nlex-slex-connector-road-toll-rate) |
| SCTEX, Tipo–Tarlac | PHP 600 | PHP 1,200 | PHP 1,800 | Sept. 9, 2025; [TRB release](https://trb.gov.ph/index.php/2015-03-24-05-42-02/47-press-release) |
| TPLEX, La Paz–Rosario | PHP 311 | PHP 778 | PHP 933 | Current page at cutoff; [TRB matrix](https://trb.gov.ph/index.php/toll-rates/tplex-toll-rate) |
| CAVITEX, Seaside–Zapote | PHP 39 | PHP 78 | PHP 117 | Oct. 28, 2025; [TRB release](https://trb.gov.ph/index.php/2015-03-24-05-42-02/47-press-release) |
| CAVITEX extension, Zapote–Kawit | PHP 88 | PHP 176 | PHP 264 | Oct. 28, 2025; same TRB release |
| MCX | PHP 23 | PHP 47 | PHP 70 | Sept. 16, 2025; same TRB release |
| CALAX, Silang–Greenfield | PHP 81 | PHP 163 | PHP 244 | TRB matrix updated Feb. 8, 2024; [TRB matrix](https://trb.gov.ph/index.php/toll-rates/calax) |
| NAIAX, full route | PHP 45 | PHP 90 | PHP 134 | Current page at cutoff; [TRB matrix](https://trb.gov.ph/index.php/toll-rates/naiax-expressway) |

NLEX implemented another adjustment on January 20, 2026: PHP 6/12/16 was added in the open system for Class 1/2/3, and the closed system changed by PHP 0.26/km for Class 1 with class multipliers. Use the operator's current gate-pair table rather than reconstructing a passenger quote from the adjustment alone. [NLEX official notice](https://nlex.com.ph/2026/01/17/trb-approves-nlex-toll-rate-adjustment/) and [current toll table](https://nlex.com.ph/toll-table/).

For a CAVITEX Seaside–Kawit through movement, adding the two separately posted plazas gives PHP 127/254/381 for Class 1/2/3. That is a **derived sum**, not a separately published through-rate. Similar sums must preserve each gate-pair source and date.

## What “standard km/h” can mean

### Legal maximum road speed

[RA 4136 section 35](https://lawphil.net/statutes/repacts/ra1964/ra_4136_1964.html) gives these default maximum allowable speeds, subject to prudent driving and more specific lawful road control:

| Road condition | Passenger car/motorcycle | Motor truck/bus |
|---|---:|---:|
| Open country road, no blind corner, not closely bordered by habitation | 80 km/h | 50 km/h |
| Designated through street/boulevard, clear traffic, no blind corner | 40 km/h | 30 km/h |
| City/municipal street with light traffic, not a through street | 30 km/h | 30 km/h |
| Crowded street, blind intersection, school zone, or similar danger | 20 km/h | 20 km/h |

The controlling rule is not “drive at the table maximum.” Section 35 first requires a careful and prudent speed that allows a stop within the assured clear distance. Posted road control and local safety rules must be checked. For example, MMDA Regulation 19-001 set 60 km/h for most vehicles on named Metro Manila radial and circumferential roads, while buses and trucks were covered by a separate 50 km/h rule. [PNA summary of the 60 km/h road set](https://www.pna.gov.ph/articles/1066594) and [contemporaneous explanation of the bus/truck rule](https://mb.com.ph/2019/04/06/mmda-explains-why-trucks-buses-excluded-from-recent-speed-limit-order/).

RA 10916 requires a standard speed limiter for covered public-utility and certain other vehicle, but the limiter is set to the maximum allowed on the particular route; it does not create one universal PUV operating speed. The [LTO implementation update](https://lto.gov.ph/news/dotr-lto-ltfrb-start-preparation-for-implementation-of-speed-limiter-in-puvs/) also shows that full implementation remained an active administrative task in 2024.

### Fare, speed, and time fields must stay separate

Recommended Project Daan fields follow the repository's singular naming rule:

```text
fare_base_php
fare_base_distance_km
fare_rate_php_per_km
fare_rate_php_per_minute
fare_discount_ratio
fare_effective_date
speed_limit_kph
speed_observed_kph
travel_time_minute
toll_amount_php
toll_vehicle_class
source_url
source_checked_at
source_status
```

Never infer `travel_time_minute` from `speed_limit_kph`: traffic, stop dwell, queue, transfer, signal, and route geometry make the legal maximum a poor arrival-time estimate. An observed or scheduled average must name its route, direction, time window, and measurement method.

## Inflation baseline

The [PSA June 2026 CPI release](https://psa.gov.ph/content/summary-inflation-report-consumer-price-index-2018100-june-2026) reported:

| Geography/household | All-item YoY | Transport YoY | Context |
|---|---:|---:|---|
| Philippines, all household | 6.4% | 12.8% | Transport contributed 1.2 percentage point, or 18.4%, of headline inflation |
| NCR, all household | 4.9% | 8.0% | Transport slowed from 11.4% in May |
| Area outside NCR, all household | — | 13.8% | Faster than NCR transport inflation |
| Philippines, bottom 30% household | 8.0% | 15.6% | [PSA bottom-30 release](https://psa.gov.ph/content/summary-inflation-report-consumer-price-index-bottom-30-income-households-2018100-june-2026) |

### Same-month cumulative price change

To avoid mixing month and base, the calculation below uses June index level from the same PSA 2018=100 table. Formula:

```text
cumulative_change_percent = (cpi_2026_06 / cpi_comparison_06 - 1) × 100
```

| Series | Jun. 2021 | Jun. 2023 | Jun. 2025 | Jun. 2026 | 1-year | 3-year | 5-year |
|---|---:|---:|---:|---:|---:|---:|---:|
| Philippines, all item | 108.3 | 121.1 | 127.3 | 135.4 | 6.36% | 11.81% | 25.02% |
| Philippines, transport | 111.7 | 126.8 | 128.6 | 145.0 | 12.75% | 14.35% | 29.81% |
| NCR, all item | 106.3 | 118.4420 | 124.2528 | 130.3 | 4.87% | 10.01% | 22.58% |
| NCR, transport | 108.2 | 123.9 | 125.5 | 135.6 | 8.05% | 9.44% | 25.32% |

Source table: [PSA OpenStat CPI table](https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2M__PI__CPI__2018NEW/0012M4ACP22.px/), queried for all item and transport, Philippines and NCR, June 2021/2023/2025/2026. Rounded results were recomputed from the displayed index level.

Interpretation: over five years, the national transport index rose about **29.8%**, faster than the all-item index's **25.0%**. This does not mean every jeepney, rail, or tricycle fare rose 29.8%. The transport division includes passenger service, fuel, vehicle purchase/use, maintenance, and toll-related components. For a commuter-affordability claim, pair CPI with the exact effective fare history and household income; do not use CPI as a fare multiplier.

### Actual regulated component change

The percentage change in one fare component is narrower than inflation. It answers “how much did this base or route-pair price change at that adjustment?” and must not be generalized to a whole trip or household budget.

| Component and adjustment | Before | After | Change | Status/source |
|---|---:|---:|---:|---|
| Traditional PUJ base, Oct. 2023 | PHP 12 | PHP 13 | +8.33% | `effective`; the [guide](https://ltfrb.gov.ph/wp-content/uploads/2024/11/Fare-Guide_Traditional-PUJ-Provisional-Fare-Increase_08Oct2023.pdf) states the PHP 1 provisional increase is included; the succeeding PHP 1.80/km did not change |
| Modern PUJ base, Oct. 2023 | PHP 14 | PHP 15 | +7.14% | `effective`; the [guide](https://www.ltfrb.gov.ph/wp-content/uploads/2024/11/Fare-Guide_Modernized-Non-Aircon-Provisional-Fare-Increase_08Oct2023.pdf) states the PHP 1 provisional increase is included |
| Regular-taxi flagdown, Mar. 2024 | PHP 45 | PHP 50 | +11.11% | `effective`; [LTFRB order](https://ltfrb.gov.ph/wp-content/uploads/2024/10/CN-2022-7433-Taxi-Fare-Increase-03-18-2024.pdf) |
| SLEX Alabang–Calamba, Class 1, Jul. 2026 | PHP 126 | PHP 137 | +8.73% | `effective`; [current TRB-rate report](https://www.autoindustriya.com/auto-industry-news/trb-announces-toll-rate-hike-for-slex-star-taking-effect-july-1.html) |
| STAR Sto. Tomas–Batangas City, Class 1, Jul. 2026 | PHP 113 | PHP 121 | +7.08% | `effective`; [current matrix report](https://www.topgear.com.ph/news/motoring-news/slex-star-tollway-july-2026-toll-prices-a6888-20260629) |
| LRT-2/MRT-3 passenger price, Mar. 2026 | 100% of standard matrix | 50% of standard matrix | −50.00% | current program price, not a base-matrix repeal; [LRTA](https://www.lrta.gov.ph/tickets-and-fares/) |

For comparison only, the suspended March 2026 traditional-PUJ proposal would have changed the base from PHP 13 to PHP 14 (+7.69%) and the succeeding rate from PHP 1.80 to PHP 2.00/km (+11.11%). Because it was suspended, both percentages describe a counterfactual approved amount, not commuter inflation actually implemented.

### Fuel-cost pressure is not the fare matrix

DOE's NCR monitor for January 13–19, 2026 showed an overall common price of PHP 54.40/L for diesel and PHP 54.10/L for RON91 gasoline. The [DOE March 10 oil monitor](https://prod-cms.doe.gov.ph/documents/d/guest/oil-monitor_10-march-2026-_male_rev-ayp-copy-1-pdf) then recorded unusually large weekly adjustments for March 10–16: diesel increases ranged from PHP 17.50 to PHP 24.25/L, gasoline from PHP 7.00 to PHP 13.00/L, and kerosene from PHP 32.00 to PHP 38.50/L across company announcements.

These two official snapshots explain cost pressure but must not be added together to invent a July pump price: brand, product, city, station, tax, and subsequent rollback differ. A current fuel component needs the latest DOE city/brand monitor. It also does not automatically change regulated passenger fare; an effective LTFRB or LGU action is still required. [DOE January NCR monitor](https://prod-cms.doe.gov.ph/documents/d/guest/ncr-price-monitoring-01132026-pdf).

## Price-change timeline

| Date | Event | Classification |
|---|---|---|
| Oct. 3, 2022 | Current city/provincial bus guides became effective | `effective` |
| Oct. 8, 2023 | Current traditional and modern PUJ guides became effective | `effective` |
| Mar. 18, 2024 | PHP 50 regular-taxi flagdown permanently standardized nationwide, excluding airport taxi | `effective` |
| Apr. 2, 2025 | LRT-1 fare adjustment implemented | `effective` |
| Sep.–Oct. 2025 | SCTEX, MCX, and CAVITEX adjustments implemented | `effective` |
| Jan. 20, 2026 | NLEX adjustment implemented | `effective` |
| Mar. 17, 2026 | Broad land-PUV increases announced | `approved` |
| Mar. 18, 2026 | Broad land-PUV increase implementation deferred | `suspended` |
| Mar. 23, 2026 | LRT-2 and MRT-3 50% across-the-board discount began | `program_active`; no end date stated on source page |
| Apr. 9, 2026 | Targeted Service Contracting fare discount announced for participating route | `program_active`/route-specific; recheck route participation |
| Jul. 1, 2026 | SLEX and STAR second-tranche toll adjustment implemented | `effective` |

## Product implication for Project Daan

Cost can become a future evidence kind without contaminating the current fixture-backed walkability score. The safe model is a separate commuter-cost receipt:

1. identify mode and exact route/LGU/station/gate pair;
2. store effective date and source status;
3. calculate fare from an official matrix only where its formula permits;
4. show transfer, toll, discount, and dynamic quote as separate component;
5. label an app quote or community report as observed, not official;
6. expire or recheck volatile source on a short cadence;
7. preserve unknown rather than substituting a nearby city's tricycle rate or an old rail matrix.

Suggested display language:

> Estimated regulated fare: PHP 23.75 for 10 km by traditional jeepney, using the LTFRB matrix effective October 8, 2023. Actual charge can differ by route distance, posted matrix, transfer, or later order. Checked July 18, 2026.

Do not silently add fare into the existing walkability score. Whether cost becomes a new score dimension requires a product decision, user research, and a normalized affordability model.

## Known gap and recheck queue

- LTFRB's index was labeled October 2024 even though later suspension and program releases exist. Recheck the index, relevant board order, and posted vehicle matrix before production use.
- No direct updated TRB page for the July 1, 2026 SLEX/STAR table was surfaced by the cutoff; two current transport publications consistently reported the TRB matrix. Replace the bridge source when TRB exposes the final table.
- A current official Skyway gate-pair matrix did not surface in the reviewed TRB pages. Do not derive it from SLEX or other Autosweep road.
- LRT-1's complete current station matrix was not text-readable in the reviewed official release. Use the station/operator matrix rather than a third-party calculator.
- PNR service outside the suspended NCR corridor needs route-by-route confirmation; the old Metro Commuter page is not proof of current operation.
- Tricycle rate outside the named Davao and Quezon City sample remains unknown until the LGU ordinance or posted matrix is obtained.
- Actual P2P bus, modern minibus, ferry, provincial van, and airport bus fare is route-specific and should enter the ledger only with an effective operator/LTFRB matrix.
- A July 18 city/brand pump-price monitor was not located in the reviewed DOE index; the January price point and March adjustment are historical pressure evidence, not a current fuel quote.
- Actual travel speed and waiting time need timestamped observation or a live operational source; a statutory maximum is not a performance measurement.
