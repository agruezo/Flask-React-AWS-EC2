from src.api.users.models import User


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user("test_user", "test_user@test.com", "testpassword")
    user_two = add_user("test_user_2", "test_user_2@test.com", "testpassword2")

    assert user_one.password != user_two.password


def test_encode_token(test_app, test_database, add_user):
    user = add_user("test_user", "test_user@test.com", "testpassword")
    token = user.encode_token(user.id, "access")
    token_two = user.encode_token(user.id, "")

    assert isinstance(token, str)
    assert isinstance(token_two, str)


def test_decode_token(test_app, test_database, add_user):
    user = add_user("test_user", "test_user@test.com", "testpassword")
    token = user.encode_token(user.id, "access")

    assert isinstance(token, str)
    assert User.decode_token(token) == user.id
