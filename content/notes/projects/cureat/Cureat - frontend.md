# Stitch
![[Cureat_UserFlowDiagram.png]]
![[Cureat_UserFlowDiagram.pix]]
디자인 초안은 Pixso로 완성하였다.
이를 stitch를 이용하여, 디자인을 입힐 예정이다.
아래는 프롬프트이다.
## 프롬프트
Cureat(Curation + Eat)이라는 신뢰성 있는 정보를 바탕으로 한 개인 맞춤 음식점 및 경로 생성 서비스를 기획하고 있어.
초안은 첨부와 같아.
해당 서비스의 신뢰성과 개인화라는 초점에 맞추어, 깔끔한 분위기에 식욕을 북돋는 색을 이용해서 디자인을 만들어 줘.
### 자세한 프롬프트
Cureat (Curation + Eat), 신뢰성 있는 정보를 바탕으로 개인형 맞춤 음식점 추천 제공 서비스이다.
총 6페이지로 구성되며, 테마 칼라는 파스텔 톤의 붉은색이다.
- 메인 페이지: 서비스명, 날씨나 개인 검색 이력 바탕의 추천 음식점 목록, 주변의 유명한 음식점 목록, 검색창(개인화 추천 검색 문장을 검색창 위에 띄워준다)
- 검색 결과 페이지: 사용자의 입력 문장에 맞춰, 추천하는 음식점들을 이미지, 요약설명과 함께 5개 띄워준다. 아래에는 메인 페이지와 동일한 검색창이 있어서, 검색 결과를 수정할 수 있다.
- 음식점 상세 페이지: 메인 페이지나 검색 결과 페이지에서 선택한 음식점에 대한 자세한 결과를 보여준다. 음식점 이미지, 음식 이미지, 평점, 가격대, 실사용 후기로 이루어진다. 화면 하단에는 담기 버튼과 나가기 버튼이 있으며, 담기 버튼은 누르면 지도 버튼으로 스위치된다.
- 지도 페이지: 상단에는 출발 위치, 도착 위치가 띄워지며, 중간 경로를 추가할 수 있다. 기본값은 현재 위치를 기반으로 담은 음식점까지의 경로를 보여준다. 두 경로 사이의 다음 추천 음식점이 자동적으로 표시된다. (이 때, 추천 음식점은 식사 이후에 어울리는 카페나 술집 등을 시간대에 따라 자동적으로 추천하게 된다) 화면 하단에는 추천 문구가 적힌 검색창이 있어, 추천 음식점을 수정할 수 있다.
- 후기 페이지: 담은 음식점에 가까이 간 후, 일정 시간이 지나면 푸시 알림으로 재방문 의사를 묻고, 간단한 이미지와 느낌을 남길 수 있도록 한다.
- 개인 페이지: 후기를 남긴 음식점들을 관리하고, 개인화 추천에 도움이 될 개인 정보들을 더 추가할 수 있다.

### 자세한 프롬프트 2
**프로젝트명:** Cureat (Curation + Eat)
**핵심 가치:** 신뢰성 있는 개인 맞춤형 맛집 추천 서비스
**총 페이지 수:** 6개
**전체 디자인 컨셉:**
- **테마 컬러:** 파스텔 톤의 붉은색(음식과 식욕을 연상시키는 따뜻한 느낌)을 메인으로 사용하고, 깔끔한 느낌을 위해 흰색과 중성적인 회색 톤을 조합해주세요.
- **디자인 톤:** 신뢰성을 강조하는 미니멀하고 깔끔한 레이아웃에, 개인화된 정보를 부각하는 직관적인 UI를 적용해 주세요.
---
### **페이지별 상세 구성**
#### **1. 메인 페이지 (Home)**
- 상단에 **서비스명 'Cureat'** 배치
- **검색창:** 사용자의 검색 이력이나 날씨에 기반한 **개인 맞춤 추천 검색 문구**를 검색창 위에 띄워줍니다.
- **추천 섹션:** '주변 인기 맛집', '개인 맞춤 추천 목록' 섹션을 분리하여 보여줍니다.
- **UI:** 간결한 아이콘과 여백을 활용하여 복잡하지 않게 구성해 주세요.
#### **2. 검색 결과 페이지 (Search Results)**
- 사용자가 입력한 검색어에 따라 **추천 음식점 5개**를 리스트 형태로 보여줍니다.
- 각 목록 항목은 **음식점 이미지, 이름, 평점, 한 줄 요약**으로 구성됩니다.
- 화면 하단에 메인 페이지와 동일한 **검색창**을 배치하여 결과를 바로 수정할 수 있도록 합니다.
#### **3. 음식점 상세 페이지 (Restaurant Details)**
- 상단에 음식점의 **외관 이미지**를 크게 보여줍니다.
- 아래에 **음식점 평점, 가격대** 정보와 함께 **실사용 후기**를 스크롤 형태로 보여줍니다.
- 후기 섹션 하단에 **'담기' 버튼**과 **'나가기' 버튼**을 배치합니다.
- **버튼 상호작용:** '담기' 버튼을 누르면 **'지도' 버튼**으로 전환됩니다.
#### **4. 지도 페이지 (Map)**
- 중앙에 **지도**를 크게 배치합니다.
- 지도 위에는 **현재 위치**를 시작점으로, **'담은 음식점'**을 목적지로 하는 경로가 표시됩니다.
- **자동 추천 기능:** 경로 중간에 식사 이후에 어울리는 **카페나 술집** 등 다음 추천 장소를 자동으로 표시합니다.
- 화면 하단에 **추천 문구가 있는 검색창**과 필터링을 위한 **태그 목록**을 배치합니다.
#### **5. 후기 페이지 (Review)**
- '담은 음식점'에 도착한 후, 일정 시간이 지나면 푸시 알림을 통해 접근하는 페이지입니다.
- 가장 위에 **'재방문 의사'**를 묻는 버튼(있음/없음)을 배치하여 직관적인 피드백을 유도합니다.
- 아래에는 **사진 첨부 공간**과 **간단한 후기**를 작성할 수 있는 텍스트 상자를 배치합니다.
#### **6. 개인 페이지 (My Page)**
- 사용자가 **후기를 남긴 음식점 목록**을 확인할 수 있도록 구성합니다.
- 개인화 추천을 위한 **'선호 음식', '취향'** 등의 추가 정보를 입력할 수 있는 섹션을 포함합니다.
### 영어
**Project Name:** Cureat (Curation + Eat)
**Core Value:** A personalized restaurant recommendation service based on reliable information.
**Total Pages:** 6
**Overall Design Concept:**
- **Theme Color:** Use a pastel red tone (evoking food and appetite) as the main color, combined with white and neutral gray tones for a clean feel.
- **Design Tone:** Apply a minimalist and clean layout to emphasize reliability, with an intuitive UI that highlights personalized information.
---
### **Page-by-Page Breakdown**
#### **1. Main Page**
- Place the service name "**Cureat**" at the top.
- **Search Bar:** Display **personalized recommended search phrases** based on weather or the user's search history above the search bar.
- **Recommendation Sections:** Show separate sections for "Popular Restaurants Nearby" and "Personalized Recommendations."
- **UI:** Utilize simple icons and ample white space to create an uncluttered interface.
#### **2. Search Results Page**
- Display a list of **5 recommended restaurants** based on the user's input, with an image and a summary for each.
- A **search bar**, identical to the one on the main page, is placed at the bottom to allow users to refine their search results.
#### **3. Restaurant Details Page**
- Show detailed information about the selected restaurant from the main or search results page.
- Include **restaurant and food images**, **ratings, price range**, and **reviews from actual users**.
- A "**Save**" and "**Exit**" button are at the bottom of the screen. The "Save" button switches to a "**Map**" button once tapped.
#### **4. Map Page**
- At the top, display the **start and end locations**, with the option to add intermediate stops.
- The default view shows the route from the user's current location to the saved restaurant.
- **Automatic Recommendation:** The system automatically suggests the **next recommended restaurant** (e.g., a café or bar that pairs well with the previous meal based on the time of day) along the route.
- A search bar with a **prompt and tag filters** is at the bottom, allowing users to modify the recommended destinations.
#### **5. Review Page**
- This page is accessed via a push notification that appears after a user has been near a saved restaurant for a certain amount of time.
- It prompts the user to rate their experience by asking if they would **"revisit"** the restaurant.
- Provides a space to upload an **image** and write a **short review**.
#### **6. Personal Page**
- Allows users to manage the list of restaurants they have **reviewed**.
- Includes a section where users can add more personal information, such as their **preferred cuisines or tastes**, to improve personalized recommendations.