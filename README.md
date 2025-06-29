# A1 DevOps Task · Kubernetes × Docker × SPA

This repository contains the **complete solution** for A1’s two‑part platform DevOps assignment:

| Part  | Directory      | Goal                                                                    | Stack                                                               |
| ----- | -------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **1** | `a1-webserver` | Serve a “Hello, Kubernetes!” page **+** a JSON health probe             | **Nginx 1.29** static container                                     |
| **2** | `a1-products`  | Single‑page app that charts prices of 10 random products from DummyJSON | **React 18**, **Chart.js 4**, **esbuild**, served by **Nginx 1.29** |

Both services can be launched either with local **Docker Compose** *or* inside a local **Kind** (Kubernetes‑in‑Docker) cluster. Each service ships its own Dockerfile, Compose stack, and K8s manifests, so you may deploy them independently or side‑by‑side (just adjust NodePorts if you run them together).

---

## ⚡ Quick Start – Local Docker Compose

```bash
# 1️⃣ Web server (Part 1)
$ cd a1-webserver
$ docker compose up --build -d
$ open http://localhost            # macOS – or use xdg‑open on Linux

# 2️⃣ Products SPA (Part 2)
$ cd ../a1-products
$ docker compose up --build -d
$ open http://localhost            # served on the same host port (stop the other stack first)
```

| Endpoint   | Purpose                                        |
| ---------- | ---------------------------------------------- |
| `/`        | HTML output (“Hello, Kubernetes!” or SPA root) |
| `/healthz` | JSON health probe `{ "status": "OK" }`         |

Both Compose files map **container 80 → host 80** for convenience.

> **Tip:** run each stack in turn, or change the exposed host port inside `docker-compose.yml` if you need both at once.

---

## ☸️ Quick Start – Kind Kubernetes

### 1. Prerequisites

- Docker 24+
- [Kind](https://kind.sigs.k8s.io/) ≥ 0.23
- `kubectl`

### 2. Create a local cluster

```bash
$ kind create cluster --name a1-cluster --config kind-cluster.yaml
```

`kind-cluster.yaml` provisions **1 control‑plane + 2 workers** and pre‑maps **NodePort 30080 → host 80** on the control‑plane node.

### 3. Build & deploy **either** service

```bash
# 🔄 Replace <service> with a1-webserver or a1-products
# From repository root
$ docker build -t <service>:latest ./<service> \
    && kind load docker-image <service>:latest --name a1-cluster \
    && kubectl apply -f <service>/k8s
```

*The image is rebuilt, loaded into all Kind nodes, and the K8s Deployment & Service are (re)applied in one liner.*

### 4. Browse the service

Open [http://localhost](http://localhost) – traffic hits NodePort 30080 on the Kind control‑plane, which we mapped to host 80.

### 5. Tear down the cluster when done

```bash
$ kind delete cluster --name a1-cluster
```

> **Running both services together?** Change ``** → **`` of one service (e.g. 30081) and add an extra `extraPortMappings` entry in `kind-cluster.yaml` so both NodePorts are exposed.

---

## 🗂 Repository Layout

```
.
├── a1-webserver                  # Part 1 – static Nginx site + health endpoint
│   ├── index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── k8s/
│       ├── deployment.yaml
│       └── service.yaml
│
├── a1-products                   # Part 2 – React + Chart.js SPA
│   ├── app.js                    # Source (ESM)
│   ├── index.html                # Root HTML
│   ├── styles.css
│   ├── Dockerfile                # Multi‑stage build & runtime
│   ├── docker-compose.yml
│   └── k8s/
│       ├── deployment.yaml
│       └── service.yaml
│
├── kind-cluster.yaml             # 1 × control + 2 × worker Kind config
└── README.md                     # ← you are here
```

---

## 🔍 Health Checks

| Service      | URL        | Expected response    |
| ------------ | ---------- | -------------------- |
| a1-webserver | `/healthz` | `{ "status": "OK" }` |
| a1-products  | `/healthz` | `{ "status": "OK" }` |

Both readiness & liveness probes in Kubernetes, and the Compose health‑checks, use the same endpoint.

