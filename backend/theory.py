import os
import django

# 1. Point to your Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# 2. Setup Django
django.setup()


from products.serializer import ProductSerializer

# from decimal import Decimal

# def recalc_current(apps, schema_editor):
#     Price = apps.get_model("your_app_name", "Price")
#     for price in Price.objects.all():
#         price.current = price.beforeDiscount * (Decimal("100") - price.discountPercentage) / Decimal("100")
products_data = [
  {
    "title": "asus vivobook 16",
    "description": "lightweight laptop with strong performance",
    "stock": 12,
    "warranty": 24,
    "category": 1,
    "brand": "asus",
    "rates": [],
    "ratings": 4.2,
    "price": {
      "currency": "USD",
      "beforeDiscount": 850,
      "discountPercentage": 10
    }
  },
  {
    "title": "apple macbook pro m2",
    "description": "premium laptop with apple silicon",
    "stock": 8,
    "warranty": 24,
    "category": 1,
    "brand": "apple",
    "rates": [],
    "ratings": 4.9,
    "price": {
      "currency": "GEL",
      "beforeDiscount": 5200,
      "discountPercentage": 0
    }
  },
  {
    "title": "samsung galaxy book 3",
    "description": "sleek laptop with AMOLED display",
    "stock": 10,
    "warranty": 18,
    "category": 1,
    "brand": "samsung",
    "rates": [],
    "ratings": 4.1,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1200,
      "discountPercentage": 12
    }
  },
  {
    "title": "lenovo thinkpad t14",
    "description": "business laptop with durability",
    "stock": 6,
    "warranty": 36,
    "category": 1,
    "brand": "lenovo",
    "rates": [],
    "ratings": 4.5,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1400,
      "discountPercentage": 0
    }
  },
  {
    "title": "xiaomi mi notebook air",
    "description": "affordable laptop with slim design",
    "stock": 14,
    "warranty": 12,
    "category": 1,
    "brand": "xiaomi",
    "rates": [],
    "ratings": 4.0,
    "price": {
      "currency": "USD",
      "beforeDiscount": 950,
      "discountPercentage": 15
    }
  },
  {
    "title": "acer aspire 7",
    "description": "budget-friendly laptop with fast performance",
    "stock": 11,
    "warranty": 12,
    "category": 1,
    "brand": "acer",
    "rates": [],
    "ratings": 3.9,
    "price": {
      "currency": "GEL",
      "beforeDiscount": 2100,
      "discountPercentage": 0
    }
  },
  {
    "title": "honor magicbook pro",
    "description": "lightweight laptop with strong battery",
    "stock": 9,
    "warranty": 24,
    "category": 1,
    "brand": "honor",
    "rates": [],
    "ratings": 4.3,
    "price": {
      "currency": "USD",
      "beforeDiscount": 780,
      "discountPercentage": 10
    }
  },
  {
    "title": "hp spectre x360",
    "description": "convertible laptop with premium design",
    "stock": 7,
    "warranty": 18,
    "category": 1,
    "brand": "hp",
    "rates": [],
    "ratings": 4.6,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1600,
      "discountPercentage": 0
    }
  },
  {
    "title": "dell xps 13",
    "description": "compact laptop with infinity display",
    "stock": 5,
    "warranty": 24,
    "category": 1,
    "brand": "dell",
    "rates": [],
    "ratings": 4.7,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1500,
      "discountPercentage": 12
    }
  },
  {
    "title": "msi stealth 15",
    "description": "gaming laptop with dedicated graphics",
    "stock": 8,
    "warranty": 24,
    "category": 1,
    "brand": "msi",
    "rates": [],
    "ratings": 4.4,
    "price": {
      "currency": "GEL",
      "beforeDiscount": 3200,
      "discountPercentage": 0
    }
  },
  {
    "title": "lg gram 16",
    "description": "ultra-light laptop with large display",
    "stock": 6,
    "warranty": 24,
    "category": 1,
    "brand": "lg",
    "rates": [],
    "ratings": 4.2,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1500,
      "discountPercentage": 10
    }
  },
  {
    "title": "oneplus padbook",
    "description": "sleek laptop with smooth performance",
    "stock": 10,
    "warranty": 18,
    "category": 1,
    "brand": "oneplus",
    "rates": [],
    "ratings": 4.0,
    "price": {
      "currency": "USD",
      "beforeDiscount": 950,
      "discountPercentage": 0
    }
  },
  {
    "title": "asus rog strix g15",
    "description": "gaming laptop with high refresh rate",
    "stock": 7,
    "warranty": 24,
    "category": 1,
    "brand": "asus",
    "rates": [],
    "ratings": 4.5,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1300,
      "discountPercentage": 10
    }
  },
  {
    "title": "apple macbook air m2",
    "description": "ultra-thin laptop with apple silicon",
    "stock": 9,
    "warranty": 24,
    "category": 1,
    "brand": "apple",
    "rates": [],
    "ratings": 4.8,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1200,
      "discountPercentage": 0
    }
  },
  {
    "title": "samsung galaxy book flex",
    "description": "convertible laptop with s-pen support",
    "stock": 8,
    "warranty": 18,
    "category": 1,
    "brand": "samsung",
    "rates": [],
    "ratings": 4.1,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1100,
      "discountPercentage": 10
    }
  },
  {
    "title": "lenovo yoga slim 7",
    "description": "thin laptop with strong battery",
    "stock": 12,
    "warranty": 24,
    "category": 1,
    "brand": "lenovo",
    "rates": [],
    "ratings": 4.3,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1000,
      "discountPercentage": 0
    }
  },
  {
    "title": "xiaomi redmibook 15",
    "description": "affordable laptop with slim design",
    "stock": 15,
    "warranty": 12,
    "category": 1,
    "brand": "xiaomi",
    "rates": [],
    "ratings": 3.9,
    "price": {
      "currency": "USD",
      "beforeDiscount": 600,
      "discountPercentage": 10
    }
  },
  {
    "title": "acer predator helios 300",
    "description": "gaming laptop with powerful GPU",
    "stock": 10,
    "warranty": 24,
    "category": 1,
    "brand": "acer",
    "rates": [],
    "ratings": 4.4,
    "price": {
      "currency": "USD",
      "beforeDiscount": 1400,
      "discountPercentage": 0
    }
  },
  {
    "title": "honor magicbook 16",
    "description": "large screen laptop with slim design",
    "stock": 8,
    "warranty": 24,
    "category": 1,
    "brand": "honor",
    "rates": [],
    "ratings": 4.2,
    "price": {
      "currency": "USD",
      "beforeDiscount": 850,
      "discountPercentage": 10
    }
  }
]



for product_data in products_data:
    serializer = ProductSerializer(data=product_data)
    if serializer.is_valid():
        serializer.save()
        print(f"Product '{product_data['title']}' added successfully.")
    else:
        print(f"Error adding '{product_data['title']}':", serializer.errors)