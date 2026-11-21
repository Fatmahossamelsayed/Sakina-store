# Sakina — متجر أزياء نسائية (ASP.NET Core 8 + EF Core + SQL Server)

موقع سكينة بعد إضافة باك إند كامل: المنتجات والطلبات متخزّنة في SQL Server، ولوحة API للأدمن بتوكن JWT.

## التشغيل
1. ثبّتي .NET 8 SDK و SQL Server LocalDB (أو غيّري `ConnectionStrings:Default`).
2. انسخي فولدر `images/` بتاعك جوه `src/Sakina.Api/wwwroot/images/`.
3. من فولدر المشروع:
   ```
   cd src/Sakina.Api
   dotnet run
   ```
   أول تشغيل بيعمل الداتابيز تلقائياً ويحط الـ 33 منتج الحاليين + حساب الأدمن.
4. افتحي `https://localhost:<port>` للموقع، و `/swagger` لتجربة الـ API.

## الـ API
| Method | Route | الوصف |
|---|---|---|
| GET | `/api/products?category=isdal` | قائمة المنتجات |
| GET | `/api/products/{id}` | منتج واحد |
| POST | `/api/orders` | إنشاء طلب (السعر بيتحسب من السيرفر، Rate-limited) |
| POST | `/api/auth/login` | تسجيل دخول الأدمن → JWT |
| GET | `/api/admin/orders?status=Pending&page=1` | الطلبات (أدمن) |
| PATCH | `/api/admin/orders/{id}/status` | تغيير حالة الطلب |
| POST/PUT/DELETE | `/api/admin/products[/{id}]` | إدارة المنتجات (DELETE = soft delete) |

## الإنتاج
ضبط `Jwt__Key` (32+ حرف) و `Admin__Password` و `ConnectionStrings__Default` كـ environment variables أو user-secrets — **متحطوش أسرار في الـ repo**.
