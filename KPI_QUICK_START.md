# KPI Implementation - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Migrations (1 minute)
```bash
cd /Users/faraibekhan/circl-backend
python3 manage.py makemigrations kpi
python3 manage.py migrate kpi
```

### Step 2: Start Django Server (1 minute)
```bash
python3 manage.py runserver 0.0.0.0:8000
```
Visit: http://localhost:8000/admin/

### Step 3: Start React Frontend (1 minute)
```bash
# In a new terminal
cd /Users/faraibekhan/circl_webapp
npm run dev
```
Visit: http://localhost:5173

### Step 4: Test KPI Features (2 minutes)
1. Login to the app
2. Navigate to a circle you manage
3. Click on the KPI section
4. Create a KPI with:
   - Name: "Test KPI"
   - Start Value: 100
   - Current Value: 150
   - Target: 200
   - Unit: "$"

### Step 5: Verify Data (Optional)
```bash
# View KPIs in Django admin
http://localhost:8000/admin/kpi/kpi/

# Test API directly
curl http://localhost:8000/api/kpi/kpis/?circle_id=1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 What Was Created

### Backend Structure
```
kpi/
├── models.py          ← Database models
├── serializers.py     ← API serializers
├── views.py          ← API endpoints
├── urls.py           ← URL routing
├── admin.py          ← Admin interface
└── tests.py          ← Test cases
```

### Frontend Structure
```
src/
├── types/kpi.ts              ← Type definitions
├── services/kpiService.ts    ← API methods
└── pages/circles/components/
    └── KPIManager.tsx        ← React component
```

## 🔌 API Endpoints You Can Use

### Get all KPIs for a circle
```bash
curl "http://localhost:8000/api/kpi/kpis/?circle_id=1" \
  -H "Authorization: Bearer TOKEN"
```

### Create a KPI
```bash
curl -X POST "http://localhost:8000/api/kpi/kpis/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Revenue",
    "start_value": 40000,
    "value": 45000,
    "target": 50000,
    "unit": "$",
    "circle": 1
  }'
```

### Update KPI value
```bash
curl -X POST "http://localhost:8000/api/kpi/kpis/1/update-value/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"value": 47000}'
```

### Get KPI history
```bash
curl "http://localhost:8000/api/kpi/kpis/1/history/" \
  -H "Authorization: Bearer TOKEN"
```

## 📊 Key Fields Explained

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| name | string | KPI name | "Monthly Revenue" |
| start_value | number | Initial value | 40000 |
| value | number | Current value | 45000 |
| target | number | Target value | 50000 |
| unit | string | Unit of measure | "$", "%", "hrs", "days" |
| trend | string | Direction | "up", "down", "neutral" |
| description | string | Details | "Q1 revenue goal" |

## 🔐 Getting an Authentication Token

### Using Django Shell
```bash
cd /Users/faraibekhan/circl-backend
python3 manage.py shell
```

```python
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

user = User.objects.get(username='your_username')
token, created = Token.objects.get_or_create(user=user)
print(token.key)
```

### Using Login Endpoint
```bash
curl -X POST "http://localhost:8000/api/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

## ✅ Verification Checklist

- [ ] Migrations applied successfully
- [ ] Django admin shows KPI models
- [ ] React app loads without errors
- [ ] Can navigate to circle
- [ ] KPI interface appears on circle page
- [ ] Can create a KPI
- [ ] Can view KPI details
- [ ] API returns data correctly

## 🐛 Common Issues & Fixes

### "ImportError: No module named 'kpi'"
```bash
# Make sure kpi is in INSTALLED_APPS in settings.py
# Check: /Users/faraibekhan/circl-backend/backend/settings.py
```

### "ModuleNotFoundError: No module named 'django'"
```bash
# Activate virtual environment or use python3 -m pip
cd /Users/faraibekhan/circl-backend
pip install -r requirements.txt
```

### "Database table does not exist"
```bash
# Run migrations
python3 manage.py migrate kpi
```

### "404 API endpoint not found"
```bash
# Check URLs are configured in backend/urls.py
# Verify: path('api/kpi/', include('kpi.urls'))
```

### React app shows loading spinner forever
```bash
# Check browser console for errors
# Verify API token is valid
# Check CORS settings in Django
```

## 📖 Documentation Quick Links

| Document | Purpose | Location |
|----------|---------|----------|
| Setup Guide | Complete setup instructions | KPI_SETUP_COMPLETE.md |
| Backend Guide | Backend API documentation | KPI_BACKEND_IMPLEMENTATION.md |
| Frontend Guide | Frontend setup | KPI_FOUNDATION_SETUP.md |
| Code Reference | Code examples | KPI_QUICK_REFERENCE.md |
| Architecture | System design | KPI_ARCHITECTURE_OVERVIEW.md |

## 💡 Pro Tips

1. **Use by_circle endpoint for better performance:**
   ```bash
   GET /api/kpi/kpis/by_circle/?circle_id=1
   ```

2. **Update only value quickly:**
   ```bash
   POST /api/kpi/kpis/{id}/update-value/
   {"value": 45000}
   ```

3. **Record history snapshots daily:**
   ```bash
   POST /api/kpi/kpis/{id}/record-history/
   ```

4. **Get historical data for charts:**
   ```bash
   GET /api/kpi/kpis/{id}/history/?days=30&limit=100
   ```

## 🎯 Next Steps

### Development
1. Test all CRUD operations
2. Try all custom endpoints
3. Check error handling
4. Verify permissions work

### Production
1. Change DEBUG=False in settings
2. Set proper ALLOWED_HOSTS
3. Configure email backend
4. Set up monitoring
5. Create admin users
6. Schedule history snapshots (Celery)

### Features
1. Add bulk KPI operations
2. Create KPI templates
3. Build analytics dashboard
4. Add KPI sharing
5. Implement notifications

## ❓ FAQ

**Q: Can I delete a KPI?**  
A: Yes, but it will delete all history too.

**Q: What happens if I don't set start_value?**  
A: It's optional; percentages will be 0.

**Q: Can non-circle members see KPIs?**  
A: No, membership is required.

**Q: How often should I record history?**  
A: Daily or weekly, depending on your needs.

**Q: Can I bulk import KPIs?**  
A: Not yet, but the API supports batch operations.

## 🎉 You're Ready!

Your KPI system is now live. Start tracking those key performance indicators! 🚀

---

**Need help?** Check the documentation files in the repo or review the test cases in `kpi/tests.py`.

**Version:** 1.0  
**Date:** January 2026
