// Handle Login Form Submission
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Login form submitted!");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            const successMessage = document.createElement("p");
            successMessage.textContent = "Login successful! Redirecting...";
            successMessage.style.color = "green";
            successMessage.style.textAlign = "center";
            document.getElementById("loginForm").appendChild(successMessage);

            setTimeout(() => {
                window.location.href = "/dashboard.html";
            }, 1000);
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.textContent = data.error || "Invalid username or password.";
            errorMessage.style.color = "red";
            errorMessage.style.textAlign = "center";
            document.getElementById("loginForm").appendChild(errorMessage);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    }
});

// Handle Registration Form Submission
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Register form submitted!");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = "/index.html";
        } else {
            alert(data.error || "Registration failed. Try again.");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
    }
});

// Load Items Function
const loadItems = async () => {
    try {
        const response = await fetch("/items.json"); // Ensure this path is correct for your project
        const items = await response.json();
        console.log("Loaded items:", items);
        return items;
    } catch (error) {
        console.error("Error loading items:", error);
        alert("Failed to load items. Please refresh the page.");
        return [];
    }
};

// Cart Functionality (Persistent with localStorage)
const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

// Add to Cart Function
const addToCart = (item) => {
    let cart = getCart();

    // Check if the item already exists in the cart
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item already in cart
    } else {
        cart.push({ ...item, quantity: 1 }); // Add item with initial quantity of 1
    }

    saveCart(cart); // Save updated cart to localStorage
    alert(`${item.name} has been added to your cart.`);
    updateCartUI(); // Update Cart UI after adding item
};

// Remove from Cart
const removeFromCart = (itemId) => {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== itemId); // Filter out the item to remove
    saveCart(cart); // Save the updated cart to localStorage
    alert("Item removed from your cart.");
    updateCartUI(); // Update Cart UI after removing item
};

// Update Cart UI
const updateCartUI = () => {
    const cartContainer = document.getElementById("cartContainer");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartContainer || !cartTotal) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "";
    } else {
        cartContainer.innerHTML = cart.map(
            (item) => `
                <div class="cart-item d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <strong>${item.name}</strong>
                        <p>Price: $${item.price.toFixed(2)} | Quantity: ${item.quantity}</p>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                </div>`
        ).join("");

        // Calculate total price
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
};

// Handle Checkout
const checkout = () => {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    alert("Thank you for your purchase!");
    saveCart([]); // Clear the cart in localStorage after checkout
    updateCartUI(); // Update Cart UI after checkout
};

// Load cart items when the page loads
function displayCart() {
    updateCartUI();
}

// Populate Browse Items
document.addEventListener("DOMContentLoaded", async () => {
    const items = await loadItems();
    const container = document.getElementById("browseItemsContainer");

    if (container && items.length > 0) {
        container.innerHTML = items.map(
            (item) => `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">Age Group: ${item.ageGroup}</p>
                            <p class="card-text">Location: ${item.location}</p>
                            <p class="card-text">Price: $${item.price.toFixed(2)}</p>
                            <button class="btn btn-primary" onclick='addToCart(${JSON.stringify(item)})'>Add to Cart</button>
                        </div>
                    </div>
                </div>`
        ).join("");
    } else if (container) {
        container.innerHTML = "<p>No items found. Please check back later.</p>";
    }

    updateCartUI();
});
