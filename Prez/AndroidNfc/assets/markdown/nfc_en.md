<div class="first-slide"></div>

# **GDG DevFest**

## 2013 Season

### 2013.11.09 DevFest @ **Nantes**


##==##

<div class="title"></div>

# **NFC & Android**

## DevFest Nantes 2013

### New Future Communication

![title](/assets/images/nfa_large.png)

<footer/>


##==##
## Qui suis-je ?

###  Jean-François GARREAU

![avatar center w-300 wp-200](/assets/images/jf.jpg)


![company_logo](/assets/images/sqli_logo.png)
![gdg_logo](/assets/images/GDG-Logo-carre.png)

<footer/>

##==##
<!--
//     _____    ____    __  __   __  __              _____   _____    ______ 
//    / ____|  / __ \  |  \/  | |  \/  |     /\     |_   _| |  __ \  |  ____|
//   | (___   | |  | | | \  / | | \  / |    /  \      | |   | |__) | | |__   
//    \___ \  | |  | | | |\/| | | |\/| |   / /\ \     | |   |  _  /  |  __|  
//    ____) | | |__| | | |  | | | |  | |  / ____ \   _| |_  | | \ \  | |____ 
//   |_____/   \____/  |_|  |_| |_|  |_| /_/    \_\ |_____| |_|  \_\ |______|
//                                                                           
//  
-->


## Agenda ## 

<div class="no-bullet"></div>


* What is NFC ?
* History
  
 * Little informations about NFC

* Standards
  
 * Theories and associated standards

* Uses
  
 * What can we do with NFC

* Demos
  
 * A litle demo

* Implementation
  
 * Concretly, how do I code that ?

* Nfa : Nfc For Android

 * Presentation of the library

* Conclusion

<footer/>

##==##

<!--
//    _   _   ______    _____     ___  
//   | \ | | |  ____|  / ____|   |__ \ 
//   |  \| | | |__    | |           ) |
//   | . ` | |  __|   | |          / / 
//   | |\  | | |      | |____     |_|  
//   |_| \_| |_|       \_____|    (_)  
//                                     
//  
-->     
<div class='transition'></div>

# What is NFC ?

![icon](assets/images/nfc_logo.jpg)

##==##


## What is NFC ?

![center h-700](assets/images/cat_scientist.jpg)

<footer/>

##==##

## What is NFC ?
### NFC = **Near Field Communication**

![center w-100](assets/images/nfc_logo.jpg)


![center w-300](assets/images/nfc_explain.jpg)


![center w-100](assets/images/nfc_card.jpg)

<footer/>

<aside class="notes">
Register by NFC FORUM for Phones mainly

User needed => Securised

RFID => Auto alimentated
</aside>

##==##

<!--
//    ______   _______              _______                _____    _______ 
//   |  ____| |__   __|     /\     |__   __|       /\     |  __ \  |__   __|
//   | |__       | |       /  \       | |         /  \    | |__) |    | |   
//   |  __|      | |      / /\ \      | |        / /\ \   |  _  /     | |   
//   | |____     | |     / ____ \     | |       / ____ \  | | \ \     | |   
//   |______|    |_|    /_/    \_\    |_|      /_/    \_\ |_|  \_\    |_|   
//                                                                          
//  
-->

<div class='transition'></div>

# History

![icon](assets/images/nfc_card.jpg)

##==##

## History
**2004**

  Nokia, Philips and Sony create the NFC Forum

<br>

**2006**
  
   First NFC Tags specifications
   
   First NFC Phone  : Nokia 6131

<br>

**2009**
  
  Add of P2P protocol. 
 

<br>
**2010**
  
  First NFC Android phone

<footer/>

<aside class="notes">
NFC Forum = 140 Company today. Unifed protocols
</aside>

##==##

## History
### Technologies : RFID / SmartCard
**NFC is based on RFID = Radio Frequency Identification**


<br>


![center w-200](assets/images/RFID.jpg)


<br>

**SmartCard :**

  NFC = extension of SmartCard, => standardisation of smartcard throught RFID communication
  
<footer/>

<aside class="notes">
RFID : Distance de pls mètres since 1983 ! 

-> Fréquence 13.56Mhz pour com < 1m

NFC pour SmartCard = NFC standard de smartCard pour la communication RFID

Questions : RFID = ISO 18092 /  Smart Card = ISO 14443-4
  
</aside>

##==##

<!--
//    _   _    ____    _____    __  __   ______    _____ 
//   | \ | |  / __ \  |  __ \  |  \/  | |  ____|  / ____|
//   |  \| | | |  | | | |__) | | \  / | | |__    | (___  
//   | . ` | | |  | | |  _  /  | |\/| | |  __|    \___ \ 
//   | |\  | | |__| | | | \ \  | |  | | | |____   ____) |
//   |_| \_|  \____/  |_|  \_\ |_|  |_| |______| |_____/ 
//                                                       
//   
-->

<div class='transition'></div>

# Standards

![icon](assets/images/iso-logo.png)

##==##

## Standards
**3 communications modes :**

![float-left w-200](assets/images/smart_card_nfc.jpg)
Card emulation
  
<br>
<br>
<br>
<br>

![float-left w-200](assets/images/social-nfc-tags.jpg)
Read / Write
  
<br>
<br>
<br>
<br>

![float-left w-200](assets/images/nfc_p2p.jpg)
Peer to Peer
  
<br>
<br>
<br>

<footer/>

<aside class="notes">
Normes Régies par le NFC Forum !

Emulation= Simulation interface carte à puce

Lecture / Ecriture : Tag

Pair à Pair : 2 Appareils
</aside>

##==##

## Standards
### Communication 

![center w-500](assets/images/reduce_speed.svg)

<footer/>

<aside class="notes">
* Rates between 106 et 424 Kps /  Communication lower to 10cm. 

Half-duplex : Communication dans les 2 sens mais chacun son tour. FullDuplex : Com 2 sens simultanément

NfcA : Modulation sur 100% -1 pour 0 après 1, 0 pour 0 après 0, 1 pour 1 après 0 ou 1

NfcB : Modulation sur 10%
</aside>

##==##

## Standards

### Protocol Others standards tolerated by Android

![float-left w-200](assets/images/felica_logo.png)
**Felica (NfcF in Android)**

 Japan

<br>
<br>
<br>
<br>

![float-left w-200](assets/images/iso-logo.png)
**ISO**

  ISO 14443 A (NfcA in Android)
  
  ISO 14443 B (NfcB in Android)
  
  15693 (NfcV in Android)

<footer/>

<aside class="notes">
Felica : Pas ISO mais NFC-Forum : Japon

15693 : ISO mais pas NFC-Forum
</aside>

##==##

## Standards
### Tag types of the NFC Forum
**The NFC forum defined 4 types of tags**

  NfcA = Type 1 / 2 / 4
  
  NfcB = Type 4
  
  NfcF = Type 3

<br>
<br>

|Type|Available memory|Communication Type|Possible Tags|
|-----|------|-|----------|
|Type 1 | 96bits -> 2Kbits | ISO 14443-A | Topaz|
|Type 2 | 48bits -> 2Kbits | ISO 14443-A | Mifare Ultra Light|
|Type 3 | ? -> 1Mbits | Felica | Felica|
|Type 4 | ? -> 32Kbits | ISO 14443 A or B | DesFire ISO 14443-A|

<footer/>

##==##

## Standards
### NDEF : NFC Data Exchange Format

![center](assets/images/Ndefrecod.png)

<br>

Header = informations about the tag

  Place in message
  
  Type
  
  Size

  Payload = Data

<footer/>

<aside class="notes">
Format d'échange standard | One Ndef = N ndef record

Predifined types

But des types = Gain de place
</aside>

##==##

## Standards
### NDEF - Informations about the message

<div id="ndef_header" ></div>

![float-left h-600](assets/images/Ndeffullrecod.png)

* **MB (Message Begin)**
  
* **ME (Message End)**
  
* **CF (Chunk Flag)**
  
* **SR (Short Reccord)**
  
* **IL (ID Length)**

* **TNF (Type Name Format)**

<footer/>

<aside class="notes">
MB = 1 => début de message | ME = 1 => Message fini dans le message  | SR : is short (1octet)

IL : si à 1 : ID Length et  ID devront être remplis

</aside>

##==##

## Standards
### NDEF - TNF (data type)

* **0x00**  Empty : Empty record
* **0x01** Well-Known Type (WKT) : Type defined by NFC Forum
* **0x02** : MIME Type
* **0x03** Absolute Uri
* **0x04** External
* **0x05** Unkown Type
* **0x06** Unchanged Type (use for truncated messages)
* **0x07** Reserved for futur use

<footer/>

##==##

## Standards
### NDEF - Type Length

<div id="ndef_length_type" ></div>

![float-left h-600](assets/images/Ndeffullrecod.png)

<footer/>

<aside class="notes">
Détail du type contenu dans le message : lié au TNF. TNF = premier type, Vrai type dans le payload ! => taille à préciser

</aside>

##==##

## Standards
### NDEF - Data length

<div id="ndef_length_payload" ></div>

![float-left h-600](assets/images/Ndeffullrecod.png)

<footer/>

<aside class="notes">
La taille varie à cause du champ SR (Short Record) : size between 1 or 4 octets

</aside>

##==##

## Standards
### NDEF - Type & Id

<div id="ndef_type_id" ></div>

![float-left h-600](assets/images/Ndeffullrecod.png)

<footer/>
  
<aside class="notes">
Type always present : Payload Type

ID dependant to IL field : record Id

</aside>

##==##

## Standards
### NDEF - Message content

<div id="ndef_payload" ></div>

![float-left h-600](assets/images/Ndeffullrecod.png)

<footer/>

##==##

## Standards
### Well Known Types

Octet **Type**

<br>

* U (0x55) for uris

<br>

* T (0x54) for text

<br>

* Sp (0x53,0x70) for smartPoster (type length is 2)

<footer/>

<aside class="notes">
Sert à gagner encore plus de bits

</aside>

##==##

## Standards
### Well Known Types

* **URIs**, 1st bit = identification bit
  
  0x00 : no prefix
  
  0x01 : http://www.
    
  0x03 : http://
    
  0x05 : tel:
  
  0x06 : mailto:
  
  0x1D : file://
  
  0x24...0xFF : reserved for futur uses


* **Text** : one octet for encoding (UTF8 =0, UTF16 = 1) and one for language
* **SmartPoster** New Ndef with the URI

<footer/>

<aside class="notes">
Le payload Varie en fonction du WKT

Pour les Uris : il y en a 35 !

SmartPoster contient dans son payload le nouvel enregistrement et les données annexes

</aside>

##==##

## Standards
### External types

You could define your own types ! 

<footer/>

<aside class="notes">
Filtrer le message et donc ouvrir le message à partir d’une application précise
</aside>

##==##

<!--
//    _    _    _____               _____   ______    _____ 
//   | |  | |  / ____|     /\      / ____| |  ____|  / ____|
//   | |  | | | (___      /  \    | |  __  | |__    | (___  
//   | |  | |  \___ \    / /\ \   | | |_ | |  __|    \___ \ 
//   | |__| |  ____) |  / ____ \  | |__| | | |____   ____) |
//    \____/  |_____/  /_/    \_\  \_____| |______| |_____/ 
//                                                          
//     
-->

<div class='transition'></div>

# Uses

![icon](assets/images/google-wallet-logo.jpg)

##==##

## Uses
### Read mode

<br>

![float-left w-300](assets/images/social-nfc-tags.jpg)

![float-left w-300](assets/images/recharge_nfc.jpg)

![w-300](assets/images/foursquare-nfc.png)

<footer/>

<aside class="notes">
Infos complementaires sur des produits  /////// GEOLOC /////// URLS

Codes promos ////// Dématérialisation de cartes
</aside>

##==##

## Uses
### P2P

![center w-600](assets/images/nfc_beam.jpg)

<footer/>

<aside class="notes">
Echange de contacts /////   Echange de fichiers //////  Configuration bluetooth
</aside>

##==##

## Uses
### Card emulation : available since KitKat (4.4)
  
![float-left w-500](assets/images/cityzi_transport.jpg)

![w-500](assets/images/google-wallet.jpg)


<footer/>

<aside class="notes">
Paiement securise   

Authentification sur des reseaux securise
</aside>


<!--
//    _____    ______   __  __    ____  
//   |  __ \  |  ____| |  \/  |  / __ \ 
//   | |  | | | |__    | \  / | | |  | |
//   | |  | | |  __|   | |\/| | | |  | |
//   | |__| | | |____  | |  | | | |__| |
//   |_____/  |______| |_|  |_|  \____/ 
//                                      
//  
-->     

##==##  

<div class='transition'></div>

# Demo

![icon](assets/images/nfc_demo.png)

<!--
//    _____   __  __   _____    _        ______   __  __   ______   _   _   _______              _______   _____    ____    _   _ 
//   |_   _| |  \/  | |  __ \  | |      |  ____| |  \/  | |  ____| | \ | | |__   __|     /\     |__   __| |_   _|  / __ \  | \ | |
//     | |   | \  / | | |__) | | |      | |__    | \  / | | |__    |  \| |    | |       /  \       | |      | |   | |  | | |  \| |
//     | |   | |\/| | |  ___/  | |      |  __|   | |\/| | |  __|   | . ` |    | |      / /\ \      | |      | |   | |  | | | . ` |
//    _| |_  | |  | | | |      | |____  | |____  | |  | | | |____  | |\  |    | |     / ____ \     | |     _| |_  | |__| | | |\  |
//   |_____| |_|  |_| |_|      |______| |______| |_|  |_| |______| |_| \_|    |_|    /_/    \_\    |_|    |_____|  \____/  |_| \_|
//                                                                                                                                
//        
-->

##==##

<div class='transition'></div>

# Implementation

![icon](assets/images/android_nfc.png)

##==##

## Implementation
### 2010 : Read / Write


![center h-500](assets/images/read_nfc.jpg)

<footer/>

##==##

## Implementation
### 2011 : Beam

![center w-800](assets/images/DBZ_fusion.png)

<footer/>

##==##

## Implementation
### 2012 : Share medias

![center h-500](assets/images/troc.gif)

<footer/>

##==##

## Implementation
### 2013 : Card Emulation

![center h-500](assets/images/mobile-payment.jpg)

<footer/>

##==##

## Implementation
### How do we code that ?

![center h-600](assets/images/nfc_tag_dispatch.png)

<footer/>

<aside class="notes">
IL n'y a pas que le NDEF de reconnu ! 

Message transformé en Intent
</aside>

##==##

## Implementation
### Configuration
**AndroidManifest.xml**

<br>

Add permission
```xml
<uses-permission android:name="android.permission.NFC"/>
```
<br>

Add feature use (only phones with NFC chip)
```xml
<uses-feature android:required="true" android:name="android.hardware.nfc"/>
```

<br>

Specify the min Sdk version
```xml
<uses-sdk android:minSdkVersion="10" />
```

<footer/>

##==##

## Implementation

### Tag reception

**We could filters tag according**

<br>

  Technology
  Mime Type

<br>

```xml
<uses-permission android:name="android.permission.NFC"/>
<intent-filter>
  <action android:name="android.nfc.action.NDEF_DISCOVERED"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <data android:scheme="http" android:host="sqli.com"/>
</intent-filter>
```

<footer/>

##==##

## Implementation

### Tags reception

**Intercept and dispatch**

<br>

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
  …
  mAdapter = NfcAdapter.getDefaultAdapter(this);
  resoudreIntent(getIntent());
}

@Override
protected void onResume() {
  super.onResume();
  …
  mAdapter.enableForegroundDispatch(this, pendingIntent, filters, techs);
}

@Override
protected void onPause() {
  …
  mAdapter.disableForegroundDispatch(this);
  super.onPause();
}
```

<footer/>

##==##

## Implementation

### Read a tag

**We read information from Intent**

<br>

```java
private void resoudreIntent(Intent intent) {
  String action = intent.getAction();
  if (NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action)) {
    Parcelable[] rawMsgs = intent.getParcelableArrayExtra(
      NfcAdapter.EXTRA_NDEF_MESSAGES);
    NdefMessage[] messages;
    NdefRecord record = null;
    if (rawMsgs != null) {
      messages = new NdefMessage[rawMsgs.length];
      for (int i = 0; i < rawMsgs.length; i++) {
        messages[i] = (NdefMessage) rawMsgs[i];
        for (int j = 0; j < messages[i].getRecords().length; j++) {
          record = messages[i].getRecords()[j];
          …
        }
      }
    }
  }
}
```

<footer/>

##==##

## Implementation

### Tag write

**You have to create a NDefMessage**

<br>

```java
String uri = "sqli.com";
byte[] uriField = uri.getBytes();
byte[] payload = new byte[uriField.length + 1];
payload[0] = 0x03;
System.arraycopy(uriField, 0, payload, 1, uriField.length);
NdefRecord record = new NdefRecord(NdefRecord.TNF_WELL_KNOWN, 
    NdefRecord.RTD_URI, 
    new byte[0], 
    payload);
NdefMessage msg = new NdefMessage(new NdefRecord[]{record});
```

<footer/>

##==##

## Implementation
### Write tag
**Then you will write on a tag (when it is detected : Intent)**

<br>

```java
private void writeTag(Intent intent) {
  Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
  final Ndef ndef = Ndef.get(tag);
  AsyncTask<Void, Void, String> taskWrite = new AsyncTask<Void, Void, String>() {
    @Override
    protected String doInBackground(Void... params) {
      try {
        ndef.connect();
        try {
        ndef.writeNdefMessage(getMessage());
        } catch (FormatException e) {}
      ndef.close();
      } catch (IOException e) {}
    }
  };
  taskWrite.execute();
}
```

<footer/>

##==##

## Implementation

### BEAM

**Override the manifest.xml**

<br>

```xml
<meta-data
  android:name="android.nfc.disable_beam_default"
  android:value="true" />
```

<br>

**Then specify that you write like for tag but for a precise intent**

<br>

```java
mAdapter.setNdefPushMessageCallback(this, this);
```

<footer/>

##==##

<!--
//    _   _   ______            
//   | \ | | |  ____|     /\    
//   |  \| | | |__       /  \   
//   | . ` | |  __|     / /\ \  
//   | |\  | | |       / ____ \ 
//   |_| \_| |_|      /_/    \_\
//                              
//   
-->

<div class='transition'></div>

# NFA : Nfc For Android

![icon](assets/images/nfa.png)

##==##

## Why ?

**NFC & Android = byte[] !**


  How to write "Hello World"

<br>

```java
byte[] languageData = "en".getBytes();

byte[] textData = "Hello World".getBytes(record.getEncoding());
byte[] payload = new byte[1 + languageData.length + textData.length];

byte status = (byte) 0x00;
payload[0] = status;
System.arraycopy(languageData, 0, payload, 1, languageData.length);
System.arraycopy(textData, 0, payload, 1 + languageData.length
      , textData.length);

NdefRecord ndefRecord = new NdefRecord(NdefRecord.TNF_WELL_KNOWN
      , NdefRecord.RTD_TEXT
      , record.getId()
      , payload);
```

<footer/>

##==##

## Why ? 

![center h-600](assets/images/meme_rock.jpg)

<footer/>

<aside class="notes">
Simplifier l'écriture. Si le nfc doit percer, il faut l'aider
</aside>

##==##

## Targets


* Non inherit base library

<br>

* Lightweight

<br>

* Helpers ! 

<br>

* Less code

<footer/>

<aside class="notes">
Parler du problème fréquent avec le multi héritage mais dire que ça sera dispo
</aside>


##==##

## Targets

![center h-600](assets/images/meme_challenge.jpg)

<footer/>

##==##

## Implementation

### Initialisation

**Android**

```java
// We register the default Nfc Adapter
mAdapter = NfcAdapter.getDefaultAdapter(activity);
// We register the curent activity to a the filters we wants
PendingIntent pendingIntent = PendingIntent.getActivity(activity, 0
  , new Intent(activity, activity.getClass())
    .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);

int length = filters != null && filters.length > 0 ? filters.length : 1;
IntentFilter[] intentFilters = new IntentFilter[length];
IntentFilter ndefFilter = new IntentFilter(filter.getAction());
pendingIntentArray.put(activity.getTaskId(), pendingIntent);    
```

**NfA**

```java
// We register our activity to the NFA Manager
NFA_MANAGER.register(activity //
    , NDEF_FILTER //        
    );
```

<footer/>

##==##

## Implementation
### Read - Android

```java
byte[] payload = ndefRecord.getPayload();
ByteArrayInputStream bais = new ByteArrayInputStream(payload);
int status = bais.read();
byte languageCodeLength = (byte) (status & TextRecord.LANGUAGE_CODE_MASK);
byte[] bytes = new byte[languageCodeLength];
bais.read(bytes, 0, bytes.length);
String languageCode = new String(bytes);
bytes = new byte[payload.length - languageCodeLength - 1];
bais.read(bytes, 0, bytes.length);
byte[] textData = bytes;
Charset textEncoding = ((status & 0x80) != 0) ? TextRecord.UTF16 
      : TextRecord.UTF8;
String message = null;
try {
  message = new String(textData, textEncoding.name());
} catch (UnsupportedEncodingException e) {
  throw new RuntimeException(e);
}
```

<footer/>

##==##

## Implementation
### Read - NfA

```java
NfaReceiveBeanBuilder<TextRecord> builder = receiveBeanConfigure(); //
builder //
.activity(activity) //
.intent(intent) //
.intentReceiveRecord(new INfaIntentReceiveRecord<TextRecord>() {

  @Override
  public void receiveRecord(TextRecord record) {
    String message = record.getText();

  }
}) // INfaIntentReceiveRecord
.parser(TEXT_PARSER); //
NFA_MANAGER.manageIntent(builder.build());
```

<footer/>

##==##

## Implementation
### Write

**Android**

```java
byte[] languageData = "en".getBytes();
byte[] textData = "Hello World".getBytes(record.getEncoding());
byte[] payload = new byte[1 + languageData.length + textData.length];
byte status = (byte) (0x00);
payload[0] = status;
System.arraycopy(languageData, 0, payload, 1, languageData.length);
System.arraycopy(textData, 0, payload, 1 + languageData.length
    , textData.length);

NdefRecord ndefRecord = new NdefRecord(NdefRecord.TNF_WELL_KNOWN
    , NdefRecord.RTD_TEXT, record.getId(), payload);
```

**NfA**

```java
NFA_MANAGER.writeTag(getApplicationContext(), //
    intent, // 
    activity, // 
    false, // addAndroidApplicationRecord
    NfaWriteBean.writeBeanConfigure() //
        .writer(TEXT_WRITER) //
        .record(NfaRecordFactory.wellKnowTypeFactory()//
          .textRecordInstance("Hello World")) //
        .build());
```


<footer/>

##==##

## RoadMap

* 0.8.0
  
 * More Writers / Parsers / Filters / Records

 * Signature Record
  
 * SmartPoster more rich

 * Unit tests :P

* 0.9.0

 * Handover Record

 * Cryptography module

 * Add some abstract class

* 1.0.0

 * Code optimisation

 * bugs fix

 * your contribution ;)

<footer/>

##==##

## Summary

![float-left](assets/images/nfa.png)


Available with maven on Oss Sonatype : http://goo.gl/NAQwd

<br>
<br>

Open source on github : [Github](https://github.com/organizations/NfcForAndroid)

<br>

Thank you to [NfcTools](https://github.com/grundid/nfctools) and [Ndef tools for Android](http://code.google.com/p/ndef-tools-for-android/)

<br>


Sample available here : [Play Store](https://play.google.com/store/apps/details?id=com.github.nfcforandroid.samples)

<footer/>

##==##

## Summary

![center h-600](assets/images/meme_baby_win.jpg)

<footer/>


<!--
//     _____    ____    _   _    _____   _        _    _    _____   _____    ____    _   _ 
//    / ____|  / __ \  | \ | |  / ____| | |      | |  | |  / ____| |_   _|  / __ \  | \ | |
//   | |      | |  | | |  \| | | |      | |      | |  | | | (___     | |   | |  | | |  \| |
//   | |      | |  | | | . ` | | |      | |      | |  | |  \___ \    | |   | |  | | | . ` |
//   | |____  | |__| | | |\  | | |____  | |____  | |__| |  ____) |  _| |_  | |__| | | |\  |
//    \_____|  \____/  |_| \_|  \_____| |______|  \____/  |_____/  |_____|  \____/  |_| \_|
//                                                                                         
//
-->

##==##

<div class='transition'></div>

# Conclusion

![icon](assets/images/nfc_logo.jpg)

##==##

## Conclusion

* The technology is pretty recent but already offers a high number of possibilities

<br>

* The secure aspect could be a problem some times

<br>

* Easy to implement (even easier with Nfc For Android ;) )

<br>

* Cheap technology (<1€ / tag)

<footer/>

##==##

<!--
//    _        _____   ______   _   _    _____ 
//   | |      |_   _| |  ____| | \ | |  / ____|
//   | |        | |   | |__    |  \| | | (___  
//   | |        | |   |  __|   | . ` |  \___ \ 
//   | |____   _| |_  | |____  | |\  |  ____) |
//   |______| |_____| |______| |_| \_| |_____/ 
//                                             
//  
--> 

<div class='transition'></div>

# Links

![icon](assets/images/link.png)



##==##

## Links

*  http://goo.gl/O3ryH The presentation

* [NFC Forum specifications](http://www.nfc-forum.org/specs/spec_list/)

* [Android NFC API](http://d.android.com/guide/topics/nfc/index.html)

* [Android Javadoc](http://d.android.com/reference/android/nfc/package-summary.html)

* [Buy tags](http://rapidnfc.com/)

* [Reader](http://nfctags.tagstand.com/collections/nfc-reader-writers/products/mini-usb-nfc-reader-writer-acr122t)

* [Nfc For Android project](https://github.com/organizations/NfcForAndroid)

* [Github Jean-François](https://github.com/organizations/binomed)

<footer/>



<!--
//     ____    _    _   ______    _____   _______   _____    ____    _   _    _____ 
//    / __ \  | |  | | |  ____|  / ____| |__   __| |_   _|  / __ \  | \ | |  / ____|
//   | |  | | | |  | | | |__    | (___      | |      | |   | |  | | |  \| | | (___  
//   | |  | | | |  | | |  __|    \___ \     | |      | |   | |  | | | . ` |  \___ \ 
//   | |__| | | |__| | | |____   ____) |    | |     _| |_  | |__| | | |\  |  ____) |
//    \___\_\  \____/  |______| |_____/     |_|    |_____|  \____/  |_| \_| |_____/ 
//                                                                                  
//   
-->

##==##

<div class="last-slide"></div>

<div class="topic-title"></div>

# NFC & Android : New Future Communication

<div class="presenter"></div>

# **Jean-François Garreau**

<div class="gdg-rule"></div>

# GDG Nantes Leader

<div class="work-rule"></div>

# Ingénieur SQLI  : @binomed / http://gplus.to/jefBinomed 

<div class="thank-message"></div>

# **Merci**

![avatar](/assets/images/jf.jpg)
