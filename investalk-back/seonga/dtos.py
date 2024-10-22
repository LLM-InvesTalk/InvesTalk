class UserDTO:
    def __init__(self, id, name, email, platform):
        self.id = id
        self.name = name
        self.email = email
        self.platform = platform

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "platform": self.platform
        }

class FavoriteStockDTO:
    def __init__(self, user_id, user_name, symbol, desired_price):
        self.user_id = user_id
        self.user_name = user_name
        self.symbol = symbol
        self.desired_price = desired_price

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "user_name": self.user_name,
            "symbol": self.symbol,
            "desired_price": self.desired_price
        }