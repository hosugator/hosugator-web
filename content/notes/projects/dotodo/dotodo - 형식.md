## To-do 항목 처리 API 응답 스키마
**반환 형식**: `List[Dict[str, Any]]`
### 각 To-do 객체의 필드 설명
|필드명|타입|설명|예시 값|
|---|---|---|---|
|`original_sentence`|`String`|사용자가 입력한 원본 문장.|"내일 아침 헬스장에 가야 해."|
|`simplified_text`|`String`|`parser`가 메타데이터(날짜, 시간)를 제외하고 명사 위주로 정제한 To-do 텍스트.|"헬스장"|
|`category`|`String`|`matcher`가 할당한 To-do의 카테고리. (`운동`, `공부`, `장보기`, `일상`, `업무` 등)|"운동"|
|`date`|`String`|`parser`가 추출한 날짜. `YYYY-MM-DD` 형식으로 변환됨.|"2025-09-24"|
|`time`|`String`|`parser`가 추출한 시간 정보.|"아침"|
|`embedding`|`List[Float]`|`simplified_text`를 `embedder`가 변환한 768차원 임베딩 벡터.|`[0.123, -0.456, ..., 0.789]`|
### 응답 예시
```
[
    {
        "original_sentence": "내일 아침 헬스장에 가야 해.",
        "simplified_text": "헬스장",
        "category": "운동",
        "date": "2025-09-24",
        "time": "아침",
        "embedding": [ ... ]
    },
    {
        "original_sentence": "오후 8시에 친구와 저녁 약속이 있어.",
        "simplified_text": "친구 저녁 약속",
        "category": "일상",
        "date": "2025-09-24",
        "time": "저녁",
        "embedding": [ ... ]
    },
    {
        "original_sentence": "주말에는 집 근처 마트에서 장을 봐야지.",
        "simplified_text": "집 근처 마트",
        "category": "장보기",
        "date": "2025-09-27",
        "time": "",
        "embedding": [ ... ]
    }
]
```