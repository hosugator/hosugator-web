---
created: 2026-06-09
updated: 2026-06-09
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[Self-development in 2026]]"
tags:
  - linux
  - printing
  - cups
  - networking
publish: true
---
## Context
Linux로 전환 후 Fuji Xerox ApeosPort-VII C3373 복합기 재연결 시도. CUPS가 mDNS(Avahi)로 자동 탐색한 큐로 출력 시도했으나 GUI에서 "Job processing failed" / "Print job was not accepted" 반복 발생. plain text는 성공하나 PDF 출력은 거부됨.

## Insight
### CUPS 자동 탐색 큐는 mDNS URI를 사용하며 불안정하다

CUPS가 Avahi로 탐색한 프린터 큐는 `ipps://DEVICE_NAME._ipps._tcp.local/` 형태의 mDNS URI를 사용한다. 이 URI는 mDNS 해석 타이밍에 따라 불안정하며, 프린터가 작업을 거부하는 원인이 된다.

### 직접 IP URI 큐가 안정적이다

`ipp://192.168.x.x/ipp/print` 형태로 직접 IP를 지정한 새 큐를 생성하면 동일 프린터에서 "Print job was not accepted" 없이 안정적으로 출력된다.

```bash
sudo lpadmin -p PRINTER_NAME \
  -E \
  -v ipp://192.168.x.x/ipp/print \
  -m everywhere

lpoptions -d PRINTER_NAME
```

### 프린터 IP 탐색은 avahi-browse가 가장 확실하다

`ip neigh show`로는 프린터를 특정하기 어렵다. `avahi-browse -a 2>/dev/null | grep -i "제조사"` 가 서비스명과 함께 프린터를 바로 식별해준다.

## Related
- [[Linux 네이티브 전환 결정 - WSL2 한계와 듀얼부팅 플랜]] — Linux 전환 이후 프린터 재설정 맥락
