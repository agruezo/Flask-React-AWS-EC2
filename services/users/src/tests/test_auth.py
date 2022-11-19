import json

import pytest
from flask import current_app


def test_user_registration(test_app, test_database):
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps(
            {"username": "me", "email": "me@user.com", "password": "testpassword"}
        ),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 201
    assert res.content_type == "application/json"
    assert "me" in data["username"]
    assert "me@user.com" in data["email"]
    assert "password" not in data


def test_user_registration_duplicate_email(test_app, test_database, add_user):
    add_user("you", "me@user.com", "testpassword")
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps(
            {"username": "me", "email": "me@user.com", "password": "testpassword"}
        ),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 400
    assert res.content_type == "application/json"
    assert "Sorry. That email already exists." in data["message"]


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"email": "me@user.com", "password": "testpassword"},
        {"username": "me", "password": "testpassword"},
        {"username": "me", "email": "me@user.com"},
    ],
)
def test_user_registration_invalid_json(test_app, test_database, payload):
    client = test_app.test_client()
    res = client.post(
        "/auth/register",
        data=json.dumps(payload),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 400
    assert res.content_type == "application/json"
    assert "Input payload validation failed" in data["message"]


def test_registered_user_login(test_app, test_database, add_user):
    add_user("he", "he@user.com", "testpassword")
    client = test_app.test_client()
    res = client.post(
        "/auth/login",
        data=json.dumps({"email": "he@user.com", "password": "testpassword"}),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 200
    assert res.content_type == "application/json"
    assert data["access_token"]
    assert data["refresh_token"]


def test_not_registered_user_login(test_app, test_database):
    client = test_app.test_client()
    res = client.post(
        "/auth/login",
        data=json.dumps({"email": "none@user.com", "password": "testpassword"}),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 404
    assert res.content_type == "application/json"
    assert "User does not exist." in data["message"]


def test_valid_refresh(test_app, test_database, add_user):
    add_user("she", "she@user.com", "testpassword")
    client = test_app.test_client()
    res = client.post(
        "/auth/login",
        data=json.dumps({"email": "she@user.com", "password": "testpassword"}),
        content_type="application/json",
    )

    refresh_token = json.loads(res.data.decode())["refresh_token"]
    res = client.post(
        "auth/refresh",
        data=json.dumps({"refresh_token": refresh_token}),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 200
    assert res.content_type == "application/json"
    assert data["access_token"]
    assert data["refresh_token"]
    assert res.content_type == "application/json"


def test_invalid_refresh_expired_token(test_app, test_database, add_user):
    add_user("they", "they@user.com", "testpassword")
    current_app.config["REFRESH_TOKEN_EXPIRATION"] = -1
    client = test_app.test_client()
    res = client.post(
        "/auth/login",
        data=json.dumps({"email": "they@user.com", "password": "testpassword"}),
        content_type="application/json",
    )

    refresh_token = json.loads(res.data.decode())["refresh_token"]
    res = client.post(
        "auth/refresh",
        data=json.dumps({"refresh_token": refresh_token}),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 401
    assert res.content_type == "application/json"
    assert "Signature expired. Please log in again." in data["message"]


def test_invalid_refresh(test_app, test_database):
    client = test_app.test_client()
    res = client.post(
        "/auth/refresh",
        data=json.dumps({"refresh_token": "Invalid"}),
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 401
    assert res.content_type == "application/json"
    assert "Invalid token. Please log in again." in data["message"]


def test_user_status(test_app, test_database, add_user):
    add_user("we", "we@user.com", "testpassword")
    client = test_app.test_client()
    res_login = client.post(
        "/auth/login",
        data=json.dumps({"email": "we@user.com", "password": "testpassword"}),
        content_type="application/json",
    )
    token = json.loads(res_login.data.decode())["access_token"]
    res = client.get(
        "/auth/status",
        headers={"Authorization": f"Bearer {token}"},
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 200
    assert res.content_type == "application/json"
    assert "we" in data["username"]
    assert "we@user.com" in data["email"]
    assert "password" not in data


def test_invalid_status(test_app, test_database):
    client = test_app.test_client()
    res = client.get(
        "/auth/status",
        headers={"Authorization": "Bearer invalid"},
        content_type="application/json",
    )
    data = json.loads(res.data.decode())

    assert res.status_code == 401
    assert res.content_type == "application/json"
    assert "Invalid token. Please log in again." in data["message"]
