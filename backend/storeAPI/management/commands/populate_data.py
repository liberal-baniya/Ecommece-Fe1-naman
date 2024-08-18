import random
from django.core.management.base import BaseCommand
from faker import Faker
from storeAPI.models import User, Category, Product, Cart, Order, OrderItem, Review, BillingAddress, Coupon

class Command(BaseCommand):
    help = "Populate database with fake data"

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Create Users
        users = []
        for _ in range(10):  # Adjust the range as needed
            user = User.objects.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                username=fake.user_name(),
                email=fake.email(),
                mobile_number=fake.phone_number(),
                password=fake.password()
            )
            users.append(user)

        # Create Categories
        categories = []
        for _ in range(7):
            category = Category.objects.create(
                name=fake.word(),
                slug=fake.slug(),
                description=fake.text(),
            )
            categories.append(category)

        # Create Products
        products = []
        for _ in range(30):
            product = Product.objects.create(
                name=fake.word(),
                brand=fake.company(),
                shipping=fake.random_element(elements=("Free", "Paid")),
                description=fake.text(),
                price=round(random.uniform(10.00, 100.00), 2),
                category=random.choice(categories),
                featured=fake.boolean(),
                active=True,
            )
            products.append(product)

        # Create Orders and OrderItems
        orders = []
        for _ in range(12):
            order = Order.objects.create(
                user=random.choice(users),
                order_number=fake.unique.random_number(digits=10),
                status=fake.random_element(elements=("pending", "shipped", "delivered", "canceled")),
            )
            orders.append(order)
            for _ in range(random.randint(1, 5)):
                OrderItem.objects.create(
                    order=order,
                    product=random.choice(products),
                    quantity=random.randint(1, 5),
                    price=random.uniform(10.00, 100.00),
                )

        # Create Cart Items
        for user in users:
            for _ in range(random.randint(1, 3)):
                Cart.objects.create(
                    user=user,
                    product=random.choice(products),
                    quantity=random.randint(1, 5),
                )

        # Create Reviews
        for product in products:
            for _ in range(random.randint(1, 5)):
                Review.objects.create(
                    product=product,
                    user=random.choice(users),
                    rate=round(random.uniform(1.0, 5.0), 1),
                    review=fake.text(),
                )

        # Create Billing Addresses
        for order in orders:
            BillingAddress.objects.create(
                order=order,
                address=fake.address(),
                city=fake.city(),
            )

        # Create Coupons
        for _ in range(5):
            coupon = Coupon.objects.create(
                code=fake.unique.lexify(text="COUPON????"),
                discount=round(random.uniform(5.00, 25.00), 2),
            )
            coupon.orders.add(random.choice(orders))

        self.stdout.write(self.style.SUCCESS("Successfully populated the database with fake data!"))
