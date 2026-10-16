# Prompts Log: Captain Haze Application

This document records all user prompts provided during the development of the **Captain Haze - Singapore Haze Tourist Guide** application.

---

### Prompt 1
**Timestamp:** 2026-10-15T01:00:40-07:00  
**Attachment:** `Captain Haze (1).jpg` (Business Model Canvas)

```text
build a guidng app for singapore tourists that provides live updates for haze situation, practical guides on where to go and what to do, what to buy, and how to get help if feel sick, refer to the attached business plan, build the app closly following the plan
```

---

### Prompt 2
**Timestamp:** 2026-10-15T01:15:59-07:00  

```text
git push http://<PERSONAL_ACCESS_TOKEN>@https://github.com/calvinchen1007/sg-haze-guide-for-tourists.git
```
*(Note: Personal access token redacted to adhere to GitHub Secret Scanning & Push Protection policy)*

---

### Prompt 3
**Timestamp:** 2026-10-15T01:25:37-07:00  

```text
add a serverless connection that pulls live data from data.gov.sg using the following endpoints:

- store this in /api folder (project root level) not the src folder
- include /health.ts, /pm25.ts, /map.ts and /psi.ts within that subfolder
- do not hardcode any key, i will include them later

GET https://api-open.data.gov.sg/v2/real-time/api/pm25

GET https://api-open.data.gov.sg/v2/real-time/api/psi

GET https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1
```

---

### Prompt 4
**Timestamp:** 2026-10-15T01:49:17-07:00  

```text
Make the web more visual and less clunky
```

---

### Prompt 5
**Timestamp:** 2026-10-15T02:05:38-07:00  

```text
1. Make a home page/overview tab showing all the highlights in each tab.
2. Allow users to key in their specific locations and then link the location to the regions and the PSI data. beacuse they might not be familar with which region they are in
3. the reginal map is not ideal, change to another more accurate one
4.
```

---

### Prompt 6
**Timestamp:** 2026-10-15T02:49:31-07:00  

```text
save all my prompts written thus far into prompt.md
```

---

### Prompt 7
**Timestamp:** 2026-10-15T23:48:56-07:00  

```text
map this into app
```

---

### Prompt 8
**Timestamp:** 2026-10-16T00:17:49-07:00  

```text
https://data.gov.sg/datasets/d_bb92615f43de22933e4479558b1f6c36/view Build backend retail pharmacy location in what to buy.
```

---

### Prompt 9
**Timestamp:** 2026-10-16T00:24:09-07:00  

```text
remove.
```

---

### Prompt 10
**Timestamp:** 2026-10-16T00:31:30-07:00  

```text
git push http://<PERSONAL_ACCESS_TOKEN>@https://github.com/jasonlimlc/Non-Haze-Activities.git head.dudenuk3m
```
*(Note: Personal access token redacted to adhere to GitHub Secret Scanning & Push Protection policy)*

---

### Prompt 11
**Timestamp:** 2026-10-16T00:42:09-07:00  

```text
// OpenStreetMap API Example
const response = await fetch('http://wiki.openstreetmap.org/wiki/API', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});

const data = await response.json();
console.log(data);

i need this for the singapore map
```

---

### Prompt 12
**Timestamp:** 2026-10-16T00:47:33-07:00  

```text
git push
```

---

### Prompt 13
**Timestamp:** 2026-10-16T00:49:00-07:00  

```text
remove pillar 1  - 4 for overview.
Maximise Map view.

improve NEA Haze Zone graphic.
```

---

### Prompt 14
**Timestamp:** 2026-10-16T00:55:15-07:00  

```text
keep overview clean.
I only need one interface, refer to image.
Remove everything else on this page
```
