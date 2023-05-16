import requests
import json,time
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
import pymysql, os, random
from datetime import datetime, timedelta
# import chromedriver_autoinstaller

def getPlacesList(start, query, code):
    url = "https://pcmap-api.place.naver.com/place/graphql"
    headers = {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        'Cookie':f'NNB={get_cookie()}'
    }
    data = {
        "operationName":"getPlacesList",
        "variables":{
            "input": {
                "query": query,
                "start": start,
                "display":50,
                "deviceType":"pc"
                },
            "isNmap":False,
            "isBounds":True
            },
            "query":"query getPlacesList($input: PlacesInput, $isNmap: Boolean!, $isBounds: Boolean!, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false) {\n  businesses: places(input: $input) {\n    total\n    items {\n      id\n      name\n      normalizedName\n      category\n      detailCid {\n        c0\n        c1\n        c2\n        c3\n        __typename\n      }\n      categoryCodeList\n      dbType\n      distance\n      roadAddress\n      address\n      fullAddress\n      commonAddress\n      bookingUrl\n      phone\n      virtualPhone\n      businessHours\n      daysOff\n      imageUrl\n      imageCount\n      x\n      y\n      poiInfo {\n        polyline {\n          shapeKey {\n            id\n            name\n            version\n            __typename\n          }\n          boundary {\n            minX\n            minY\n            maxX\n            maxY\n            __typename\n          }\n          details {\n            totalDistance\n            arrivalAddress\n            departureAddress\n            __typename\n          }\n          __typename\n        }\n        polygon {\n          shapeKey {\n            id\n            name\n            version\n            __typename\n          }\n          boundary {\n            minX\n            minY\n            maxX\n            maxY\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      subwayId\n      markerId @include(if: $isNmap)\n      markerLabel @include(if: $isNmap) {\n        text\n        style\n        stylePreset\n        __typename\n      }\n      imageMarker @include(if: $isNmap) {\n        marker\n        markerSelected\n        __typename\n      }\n      oilPrice @include(if: $isNmap) {\n        gasoline\n        diesel\n        lpg\n        __typename\n      }\n      isPublicGas\n      isDelivery\n      isTableOrder\n      isPreOrder\n      isTakeOut\n      isCvsDelivery\n      hasBooking\n      naverBookingCategory\n      bookingDisplayName\n      bookingBusinessId\n      bookingVisitId\n      bookingPickupId\n      easyOrder {\n        easyOrderId\n        easyOrderCid\n        businessHours {\n          weekday {\n            start\n            end\n            __typename\n          }\n          weekend {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      baemin {\n        businessHours {\n          deliveryTime {\n            start\n            end\n            __typename\n          }\n          closeDate {\n            start\n            end\n            __typename\n          }\n          temporaryCloseDate {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      yogiyo {\n        businessHours {\n          actualDeliveryTime {\n            start\n            end\n            __typename\n          }\n          bizHours {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      isPollingStation\n      hasNPay\n      talktalkUrl\n      visitorReviewCount\n      visitorReviewScore\n      blogCafeReviewCount\n      bookingReviewCount\n      streetPanorama {\n        id\n        pan\n        tilt\n        lat\n        lon\n        __typename\n      }\n      naverBookingHubId\n      bookingHubUrl\n      bookingHubButtonName\n      newOpening\n      newBusinessHours {\n        status\n        description\n        dayOff\n        dayOffDescription\n        __typename\n      }\n      coupon {\n        total\n        promotions {\n          promotionSeq\n          couponSeq\n          conditionType\n          image {\n            url\n            __typename\n          }\n          title\n          description\n          type\n          couponUseType\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      displayCorrectAnswer\n      correctAnswerPlaceId\n      __typename\n    }\n    searchGuide {\n      queryResults {\n        regions {\n          displayTitle\n          query\n          region {\n            rcode\n            __typename\n          }\n          __typename\n        }\n        isBusinessName\n        __typename\n      }\n      queryIndex\n      types\n      __typename\n    }\n    queryString\n    siteSort\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n"
    }
    data = json.dumps(data)
    result = requests.post(url, headers=headers, data=data)
    result = json.loads(result.text)
    result = (result['data']['businesses']['items']) # 현재 변수 result 에는 딕셔너리가 저장되어 있으니 key 값 사용하여 원하시는 값 불러오시면 됩니다.
    id_list = [re['id'] for re in result]
    if not id_list:
        return "NO DATA"
    is_rank = code in id_list
    if is_rank == False:
        return "NOT RANK"
    rank = id_list.index(code)
    rank += start
    return(rank)

def getBeautyList(start, query, code):
    url = "https://pcmap-api.place.naver.com/place/graphql"
    headers = {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        'Cookie':f'NNB={get_cookie()}'
    }
    data = {
        "operationName":"getBeautyList",
        "variables":{
            "businessType": "hairshop",
            "input": {
                "query": query,
                "start": start,
                "display":50,
                "sortingOrder": "precision",
                "deviceType":"pc"
                },
            "isNmap":False,
            "isBounds":True
            },
            "query":"query getBeautyList($input: BeautyListInput, $businessType: String, $isNmap: Boolean!, $isBounds: Boolean!, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false) {\n  businesses: hairshops(input: $input) {\n    total\n    items {\n      ...BeautyItemFields\n      imageMarker @include(if: $isNmap) {\n        marker\n        markerSelected\n        __typename\n      }\n      markerId @include(if: $isNmap)\n      markerLabel @include(if: $isNmap) {\n        text\n        style\n        __typename\n      }\n      __typename\n    }\n    nlu {\n      ...NluFields\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      __typename\n    }\n    userGender\n    __typename\n  }\n  brands: beautyBrands(input: $input, businessType: $businessType) {\n    name\n    cid\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n\nfragment NluFields on Nlu {\n  queryType\n  user {\n    gender\n    __typename\n  }\n  queryResult {\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    nluQuery\n    businessType\n    cid\n    branch\n    forYou\n    franchise\n    titleKeyword\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    repRegion\n    repSpot\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    type\n    category\n    menu\n    context\n    __typename\n  }\n  __typename\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment BeautyItemFields on BeautySummary {\n  id\n  apolloCacheId\n  name\n  hasBooking\n  hasNPay\n  blogCafeReviewCount\n  bookingReviewCount\n  bookingReviewScore\n  description\n  roadAddress\n  address\n  imageUrl\n  talktalkUrl\n  distance\n  x\n  y\n  representativePrice {\n    isFiltered\n    priceName\n    price\n    __typename\n  }\n  promotionTitle\n  stylesCount\n  styles {\n    desc\n    shortDesc\n    styleNum\n    isPopular\n    images {\n      imageUrl\n      __typename\n    }\n    styleOptions {\n      num\n      __typename\n    }\n    __typename\n  }\n  visitorReviewCount\n  visitorReviewScore\n  streetPanorama {\n    id\n    pan\n    tilt\n    lat\n    lon\n    __typename\n  }\n  styleBookingCounts {\n    styleNum\n    name\n    count\n    isPopular\n    __typename\n  }\n  newOpening\n  coupon {\n    total\n    promotions {\n      promotionSeq\n      couponSeq\n      conditionType\n      image {\n        url\n        __typename\n      }\n      title\n      description\n      type\n      couponUseType\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"
    }
    data = json.dumps(data)
    result = requests.post(url, headers=headers, data=data)
    result = json.loads(result.text)
    result = (result['data']['businesses']['items']) # 현재 변수 result 에는 딕셔너리가 저장되어 있으니 key 값 사용하여 원하시는 값 불러오시면 됩니다.
    id_list = [re['id'] for re in result]
    if not id_list:
        return "NO DATA"
    is_rank = code in id_list
    if is_rank == False:
        return "NOT RANK"
    rank = id_list.index(code)
    rank += start
    return rank
    time.sleep(1.5)


def Cranking(keyword, code, businesseType):
    start = 1
    while True:
        if (start > 1000):
            rank == "NO DATA"
            break
        if businesseType == 'hairshop':
            rank = getBeautyList(start, keyword, code)
        else:
            rank = getPlacesList(start, keyword, code)
        if rank == "NO DATA":
            rank = 0
            break
        elif rank == "NOT RANK":
            pass
        else:
            break
        start += 50
        time.sleep(1.5)
    return rank

dir = (os.path.dirname(os.path.realpath(__file__)))

conno = pymysql.connect(
    user='OSJ',
    passwd='DHtmdwns1521@',
    host='hmkting.synology.me',
    charset='utf8',
    port=3307
)

def get_cookie():
    cokies = """
32KHEDUN5VPGI
BVT5WCM25VPGI
O3JOGWVG5VPGI
DJ2FCQNS5VPGI
JRNKWV575VPGI
J56NMSGL5VPGI
DCYJSTGX5VPGI
OK5FKSXE5VPGI
U5C42RXQ5VPGI
3DWLSQX45VPGI
EAEUWWQI5ZPGI
A3QG6QQV5ZPGI
JRFFSTRB5ZPGI
VYMMYVZO5ZPGI
ZXXHQBB25ZPGI
2C4IMVKH5ZPGI
EFEAMP2T5ZPGI
CC3QEQS75ZPGI
YBLAUGTL5ZPGI
3CZT2VLX5ZPGI
6VIAQWUD5ZPGI
U3YKSUMP5ZPGI
6A4TCF435ZPGI
I4FJEDFH5ZPGI
SGZTESNU5ZPGI
RHJDGAOA5ZPGI
H55R6PWM5ZPGI
MDZXMWGY5ZPGI
BU3KMP7F5ZPGI
SV7W6IXR5ZPGI
WNA62HX55ZPGI
F4CWGBIK55PGI
HW7Q6EIW55PGI
UWHMUDJC55PGI
XA26GJJP55PGI
3ZWPSBJ355PGI
STZ5OC2G55PGI
OG4N6EST55PGI
XYMEMBS755PGI
DUY24ATM55PGI
HTEEUGLY55PGI
OCEJKQME55PGI
YO4RUWEQ55PGI
C35C4KM655PGI
PG2KSIVK55PGI
CJVJ6NFX55PGI
LETNMLGD55PGI
XBRM4JWP55PGI
WR4BIMW355PGI
IBMG6N7I55PGI
IKEXUIPU55PGI
6F5DUQQA6BPGI
46MXOCIM6BPGI
RFKNILYZ6BPGI
5EUDIRJF6BPGI
NKZW6RBS6BPGI
P6MEQFJ66BPGI
NNMSYDCL6BPGI
H3EVST2W6BPGI
6RL64MTC6BPGI
BJN5IGDO6BPGI
DJHHOBT46BPGI
G22XEE4I6BPGI
NW7ZGFEV6BPGI
TBXVIPFA6BPGI
6RUTCHFN6BPGI
GV4EUK5Z6BPGI
W2WYWPGG6BPGI
PXNA2EWS6BPGI
PG2UMHG66BPGI
663Z4OHK6BPGI
GA6VAL7W6BPGI
BZO7GFAC6FPGI
TPINMFQO6FPGI
KY3ZKDI26FPGI
ORBCOCJG6FPGI
WTQBQJRS6FPGI
EERGGUR76FPGI
PXLQMA2M6FPGI
EOFDEESZ6FPGI
SGDSWMDG6FPGI
2VMVOSTS6FPGI
BKGA2U376FPGI
T7Q4ETML6FPGI
SBD5CTUY6FPGI
V6EKUAND6FPGI
LURTYH5P6FPGI
2E6LARV46FPGI
YFAUGNOI6FPGI
QC2V4TGV6FPGI
BTRQ6LXB6FPGI
ZZIM6TPO6FPGI
IHGASJX26FPGI
2OAUWVAH6JPGI
YJCNGOAU6JPGI
Y2K24WRB6JPGI
TQXR6QZN6JPGI
I5ZRIQJ26JPGI
VEBAMT2G6JPGI
3DT7QEST6JPGI
FCKHME276JPGI
QYMZYQ3M6JPGI
VKZC2Q3Y6JPGI
F7JP4REF6JPGI
JD444PMR6JPGI
NL52OWU56JPGI
M4TFOTNK6JPGI
KXRHSVFW6JPGI
MAC66RWC6JPGI
7XDU2PWP6JPGI
ETRTMRO46JPGI
VH73IJXI6JPGI
KU772OXW6JPGI
KNXY6QIC6NPGI
H6ZCGQAP6NPGI
KZ23QJI36NPGI
KGBVEVZH6NPGI
H4KXOEJU6NPGI
HSEV6HSA6NPGI
3HZQSUSN6NPGI
YVUCQSSZ6NPGI
NGAVCWTE6NPGI
G553MWDQ6NPGI
WO34MT356NPGI
C2UPOMEJ6NPGI
5MI2WJMV6NPGI
ZNTHSPNC6NPGI
25IUKJVO6NPGI
KXPNUT536NPGI
WBISIRWI6NPGI
PPMCYVGU6NPGI
NRZJ2KHA6NPGI
YXJKCIXM6NPGI
S5XG2JXZ6NPGI
GI7C2SIG6RPGI
KSBNYVAS6RPGI
LZVXMVI66RPGI
BOAWWLBL6RPGI
FQ6FMPJX6RPGI
RCBDUPSC6RPGI
6SVBCTSN6RPGI
NQHJYBS26RPGI
IPEZKBTG6RPGI
5MTXQATS6RPGI
4GC7OT366RPGI
HIIG6CUL6RPGI
PS4N6P4X6RPGI
5YY6ISVE6RPGI
XKCRSNFQ6RPGI
PCR5IRF46RPGI
QNM3CAOI6RPGI
XWEZEHOV6RPGI
OF76IA7B6RPGI
DOOOOPXN6RPGI
7TWJCFXZ6RPGI
QPELUVAG6VPGI
Y2PCIEAS6VPGI
ICH7GKQ76VPGI
JAICAPBL6VPGI
OKDO2QJX6VPGI
U7ZOWHCF6VPGI
VR4AUHSQ6VPGI
VZL5UF236VPGI
6C4H2H3H6VPGI
G3V26LLU6VPGI
DNWG6KUA6VPGI
EGN5QK4M6VPGI
FVQEYK4Y6VPGI
LATSUBVF6VPGI
WNJP2HFS6VPGI
M4QN2S566VPGI
7U2KAM6K6VPGI
4M4N2N6W6VPGI
Y3ZCMIXE6VPGI
EX2CSI7Q6VPGI
U55UCHX56VPGI
RTBZ2DYK6ZPGI
A2MZKFQW6ZPGI
EJEEYDZD6ZPGI
4Y5OKPRP6ZPGI
6X2TGQJ46ZPGI
Q2HAASSI6ZPGI
JLGEGMCV6ZPGI
C7R3KGLB6ZPGI
XTQJCR3O6ZPGI
56AXET336ZPGI
URAQOTMH6ZPGI
APF6UQ4U6ZPGI
W2CS4SFA6ZPGI
RMAISSVM6ZPGI
UZD76UVZ6ZPGI
Z2AEEPGF6ZPGI
AXSGCSWR6ZPGI
IPSZ4RW66ZPGI
G5BWKPHL6ZPGI
ZHA3GMHW6ZPGI
QVHG6QQD65PGI
IKBGKOAP65PGI
HADFWBI465PGI
J75GUIJI65PGI
KCOT6VJV65PGI
PH7ZAK2B65PGI
NJBEKK2N65PGI
UWCQKVS265PGI
A3KA2OTG65PGI
4DRQ2M3S65PGI
Q2CW2T3765PGI
ZPJK6BML65PGI
WYUWOL4Y65PGI
BO4HKWVE65PGI
IG6J2NNQ65PGI
RRCPGQF465PGI
WAGP4CGJ65PGI
25NBMIGW65PGI
6DOGSJHC65PGI
ULHBMFXP65PGI
DMTDMVX465PGI
2E7N4EAH7BPGI
2UXJQQAU7BPGI
2DFXURJA7BPGI
UPKOSPZN7BPGI
4OZL4PBZ7BPGI
P6MYKEKF7BPGI
5BBAKU2S7BPGI
QIW7AQK67BPGI
EGZ46RDK7BPGI
N2LISR3W7BPGI
VEMUEIED7BPGI
56EPWKUQ7BPGI
33XWAJ447BPGI
D7Y3OC5J7BPGI
OQTXSRFX7BPGI
PPSGCC6C7BPGI
TFK5YBWP7BPGI
7RI6UMW37BPGI
EXTJ2UXG7BPGI
VYFJQUXT7BPGI
B4ANSLAA7FPGI
OBLSWQAN7FPGI
ONX6CSYZ7FPGI
YGXE4AJF7FPGI
IHORSKBR7FPGI
6SE7KKR67FPGI
JSDC4VCK7FPGI
ELQI4PKW7FPGI
D3YFGJLC7FPGI
SWFJWM3P7FPGI
SD2ASV337FPGI
OQM5MOMH7FPGI
Z2SKALEU7FPGI
WRW5IRVA7FPGI
WFIKMRFM7FPGI
WWTZUQVY7FPGI
M4RUSMWF7FPGI
JZD5OT6Q7FPGI
XQ3JASW57FPGI
DJH2MWHK7FPGI
JU37SJHX7FPGI
FXQ3ITQD7JPGI
X67WQJIP7JPGI
SQHPOVI47JPGI
5HR22RJI7JPGI
X4ZDWSJV7JPGI
NYPUONKB7JPGI
3X256UKO7JPGI
CT7VATK27JPGI
YV77WV3H7JPGI
YJE7UULT7JPGI
BOIR6A377JPGI
MMQSCIUL7JPGI
UUXOAG4Y7JPGI
LK5HANND7JPGI
2O4PEMFP7JPGI
6JKPCJV37JPGI
M6CQ6VGI7JPGI
QMVCGSOU7JPGI
ZUTQSN7B7JPGI
3PRRALXO7JPGI
WOXN6L727JPGI
M7JBKOAG7NPGI
AVOIMJAS7NPGI
7JGDQLI77NPGI
FCFL2IRL7NPGI
AEZ2YJRX7NPGI
YPYZGHKE7NPGI
H3SMGOKQ7NPGI
74ATMKC47NPGI
WGUGABLK7NPGI
6HTH6ODV7NPGI
5LASYCEA7NPGI
XER7AH4N7NPGI
5JSZOPEY7NPGI
37B2AOVD7NPGI
E4HJSKVO7NPGI
XXCREOVZ7NPGI
ZN6KMSGH7NPGI
5Z42GLGT7NPGI
CMSZWMO77NPGI
BLBK6A7L7NPGI
6BHZ4DPW7NPGI
IDOEEMQC7RPGI
7HP2ARAO7RPGI
CW53YOY27RPGI
JBKQSARF7RPGI
D6MJIMRQ7RPGI
JIAJ2BJ47RPGI
WDBG6M2I7RPGI
ZNLLKOCU7RPGI
HBVDEM3A7RPGI
LWREWNTM7RPGI
A35DAHTY7RPGI
SKWSGRME7RPGI
PFBCICMP7RPGI
2MGKOOM47RPGI
VWT5SSFI7RPGI
6R47YDVT7RPGI
TYTVUOV77RPGI
BLGVET6L7RPGI
MSJZEGWV7RPGI
4NBT6OXB7RPGI
UZCWWEXN7RPGI
4OPZWWP27RPGI
M4MQELIF7VPGI
APVR4KQR7VPGI
IRUS4SQ57VPGI
35Q7GIBI7VPGI
MOQSWAJU7VPGI
QT4ZCB2A7VPGI
JGUUSG2M7VPGI
Z25XMSSZ7VPGI
22KSUPTF7VPGI
BZVR2T3S7VPGI
YXFKWQT67VPGI
4E7QYWMK7VPGI
DM3ECQMX7VPGI
SNZ4MHND7VPGI
COESORVP7VPGI
YWIVYSV47VPGI
UZDGQJ6I7VPGI
VPOC4QGU7VPGI
ZOBUQH7B7VPGI
B46ACRPP7VPGI
XUD2OPP47VPGI
PPKNCIAJ7ZPGI
SIXJWRYV7ZPGI
45EJCWRC7ZPGI
SQ2LWJRO7ZPGI
YIPLAVB27ZPGI
QJ7B6SCH7ZPGI
AP32SGSU7ZPGI
QZOHOVTA7ZPGI
5UHMQVDM7ZPGI
D5KZCODY7ZPGI
NBRRAR4D7ZPGI
B5TSOLMO7ZPGI
47XZ4PM27ZPGI
HG7R6HFF7ZPGI
JLAOKVFR7ZPGI
JBEHQGV57ZPGI
V7TWWF6J7ZPGI
VIAVSBWU7ZPGI
4JZGWTHA7ZPGI
AOXK6QPL7ZPGI
2KJREHPX7ZPGI
5BCA2KAC75PGI
7SMHCGYN75PGI
FGDAGPYY75PGI
SXVSSBZE75PGI
GAD46CJP75PGI
UPWJCTB375PGI
OCFSSS2H75PGI
    """
    cookie = random.choice(cokies.split("\n"))
    return cookie

curo = conno.cursor()

sql = 'select * from OSJ.company_ranking'
curo.execute(sql)
datas = curo.fetchall()

headers = {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    'Cookie':f'NNB=GFIVUWR7WOKGG'
}

count = 1
now = datetime.today()
now = now.strftime("%Y-%m-%d")
nsql = f"select * from OSJ.company_ranking_data where created_at BETWEEN '{now} 00:00:00' and '{now} 23:59:59' order by ids desc"
curo.execute(nsql)
last_data = curo.fetchall()
if not last_data:
    pass
else:
    count = count + last_data[0][6]


yesterday = datetime.today() - timedelta(1)
yesterday = yesterday.strftime("%Y-%m-%d")
ysql = f"select * from OSJ.company_ranking_data where created_at BETWEEN '{yesterday} 00:00:00' and '{yesterday} 23:59:59'"
curo.execute(ysql)
yesterData = curo.fetchall()
yesterData = [[i[5], i[3], i[2]] for i in yesterData]


for dt in datas:
    print(dt[4])
    keyword = dt[3]
    code = dt[7]
    businesseType = dt[9]
    rank = Cranking(keyword, code, businesseType)
    created_at_origin = datetime.today()
    created_at = created_at_origin.strftime("%Y-%m-%d")
    created_at_sql = datetime.strptime(created_at, '%Y-%m-%d')
    yesdata = list(filter(lambda x: x[0] == code and x[1] == keyword, yesterData))
    if yesdata == []:
        sql = 'insert into OSJ.company_ranking_data (created_at, rank, keyword, code, count) values (%s, %s, %s, %s, %s)'
        print(created_at_sql, str(rank), code, keyword)
        curo.execute(sql, (created_at_sql, str(rank), keyword, code, count))
    else:
        yesdata = yesdata[0][2]
        print(dt)
        print(yesdata)
        print(rank)
        rate = int(yesdata) - int(rank)
        if rate == 0:
            range = None
        elif rate > 0:
            range = 'blue'
        else:
            range = 'red'
        print(created_at_sql, str(rank), code, keyword, range)
        sql = 'insert into OSJ.company_ranking_data (created_at, rank, keyword, rate, code, count) values (%s, %s, %s, %s, %s, %s)'
        curo.execute(sql, (created_at_sql, str(rank), keyword, range, code, count))
    time.sleep(2)
conno.commit()
