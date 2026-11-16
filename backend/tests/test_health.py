def test_health_reports_versions(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["qiskit"]


def test_unimplemented_routes_return_501(client):
    res = client.post("/api/distribution/teaching", json={"n_participants": 3, "secret_bit": 1})
    assert res.status_code == 501
    assert res.json()["todo"] == "services.distribution_service.run_teaching_mode"
