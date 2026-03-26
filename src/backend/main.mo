import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Type
  type ProductId = Nat;

  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    imageUrl : Text;
    category : Text;
    amazonPrice : Float;
    amazonLink : Text;
    flipkartPrice : Float;
    flipkartLink : Text;
    createdAt : Int;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  // Product Input Type
  type ProductInput = {
    name : Text;
    description : Text;
    imageUrl : Text;
    category : Text;
    amazonPrice : Float;
    amazonLink : Text;
    flipkartPrice : Float;
    flipkartLink : Text;
  };

  // Product Store
  let products = Map.empty<ProductId, Product>();
  var nextProductId = 1;

  // Get single product (public read access)
  public query func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // List products with optional category filter (public read access)
  public query func listProducts(category : ?Text) : async [Product] {
    let productList = List.empty<Product>();
    for (product in products.values()) {
      switch (category) {
        case (null) { productList.add(product) };
        case (?cat) {
          if (product.category.toLower().contains(#text(cat.toLower()))) {
            productList.add(product);
          };
        };
      };
    };
    productList.toArray().sort();
  };

  // Search products by name (public read access)
  public query func searchProducts(searchTerm : Text) : async [Product] {
    let searchLower = searchTerm.toLower();
    let productList = List.empty<Product>();

    for (product in products.values()) {
      let nameLower = product.name.toLower();
      if (nameLower.contains(#text(searchLower))) {
        productList.add(product);
      };
    };
    productList.toArray().sort();
  };

  // List all unique categories (public read access)
  public query func listCategories() : async [Text] {
    let categoryList = List.empty<Text>();
    let categories = List.empty<Text>();

    for (product in products.values()) {
      var isUnique = true;
      for (cat in categories.values()) {
        if (product.category.toLower() == cat.toLower()) {
          isUnique := false;
        };
      };
      if (isUnique) {
        categories.add(product.category);
      };
    };
    categories.toArray();
  };

  // Create product (admin only)
  public shared ({ caller }) func createProduct(input : ProductInput) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let product : Product = {
      id = nextProductId;
      name = input.name;
      description = input.description;
      imageUrl = input.imageUrl;
      category = input.category;
      amazonPrice = input.amazonPrice;
      amazonLink = input.amazonLink;
      flipkartPrice = input.flipkartPrice;
      flipkartLink = input.flipkartLink;
      createdAt = Time.now();
    };

    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  // Update product (admin only)
  public shared ({ caller }) func updateProduct(id : ProductId, input : ProductInput) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = existingProduct.id;
          name = input.name;
          description = input.description;
          imageUrl = input.imageUrl;
          category = input.category;
          amazonPrice = input.amazonPrice;
          amazonLink = input.amazonLink;
          flipkartPrice = input.flipkartPrice;
          flipkartLink = input.flipkartLink;
          createdAt = existingProduct.createdAt;
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
    };
  };

  // Delete product (admin only)
  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  // List all products (public read access)
  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };
};
