# Relevé ponctuel des prix affichés sur chiots-de-france.com : une page par race, une requête toutes les 2 s.
import re, json, time, sys, urllib.request, statistics
CAND = {
 'golden-retriever':['golden-retriever'], 'berger-australien':['berger-australien'], 'staffordshire-bull-terrier':['staffordshire-bull-terrier'],
 'cocker-spaniel':['cocker-spaniel-anglais','english-cocker-spaniel','cocker-anglais'], 'labrador-retriever':['labrador-retriever'],
 'berger-americain-miniature':['berger-americain'], 'cavalier-king-charles':['cavalier-king-charles'],
 'berger-belge-malinois':['berger-belge','berger-belge-malinois'], 'berger-allemand':['berger-allemand'], 'teckel':['teckel-poil-ras','teckel','teckel-poil-dur'],
 'setter-anglais':['setter-anglais'], 'epagneul-breton':['epagneul-breton'], 'cane-corso':['cane-corso'], 'beagle':['beagle'], 'chihuahua':['chihuahua'],
 'rottweiler':['rottweiler'], 'border-collie':['border-collie'], 'husky-siberien':['siberian-husky','husky-siberien','husky-de-siberie'],
 'bouledogue-francais':['bouledogue-francais'], 'bouvier-bernois':['bouvier-bernois'], 'beauceron':['berger-de-beauce','beauceron'], 'shiba-inu':['shiba','shiba-inu'],
 'berger-blanc-suisse':['berger-blanc-suisse'], 'eurasier':['eurasier'], 'spitz-nain-loulou-de-pomeranie':['spitz-allemand','spitz-nain','spitz-allemand-nain'],
 'yorkshire-terrier':['yorkshire-terrier'], 'shih-tzu':['shih-tzu'], 'shetland-sheepdog-berger-des-shetland':['shetland-sheepdog','berger-des-shetland'],
 'staffordshire-terrier-americain':['american-staffordshire-terrier','staffordshire-terrier-americain'], 'jack-russell-terrier':['jack-russell'],
 'welsh-corgi-pembroke':['welsh-corgi-pembroke'], 'boxer':['boxer'], 'whippet':['whippet'], 'samoyede':['samoyede'], 'coton-de-tulear':['coton-de-tulear'],
}
def get(u):
    req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req,timeout=25) as r: return r.status, r.read().decode('utf-8','ignore')
    except Exception as e: return getattr(e,'code',0), ''
out={}
for slug,cands in CAND.items():
    for c in cands:
        st,s=get(f'https://www.chiots-de-france.com/chiots/{c}/france'); time.sleep(2)
        boxes=re.findall(r'<a href="[^"]*detail-annonce[^"]*" class="box".*?</a>',s,re.S)
        if st==200 and boxes:
            ads=[]
            for b in boxes:
                race=re.sub(r'\s+',' ',re.search(r'<div class="race">(.*?)</div>',b,re.S).group(1)).strip()
                m=re.search(r'<div class="prix[^"]*">\s*([\d\s .]+)€',b)
                prix=int(re.sub(r'\D','',m.group(1))) if m else None
                lof='<div class="vign">LOF</div>' in b
                vend='particulier' if re.search(r'>\s*Particulier\s*<',b) else 'elevage'
                ads.append({'race':race,'prix':prix,'lof':lof,'vendeur':vend})
            total=re.search(r'\((\d+)\)',re.search(r'<h1[^>]*>(.*?)</h1>',s,re.S).group(1)) if re.search(r'<h1[^>]*>(.*?)</h1>',s,re.S) else None
            out[slug]={'page':f'https://www.chiots-de-france.com/chiots/{c}','total_site':int(total.group(1)) if total else None,'annonces':ads}
            p=[a['prix'] for a in ads if a['prix'] and a['lof']]
            print(f"{slug:38s} {c:32s} {len(ads):3d} annonces, {len(p):2d} prix LOF", (min(p),int(statistics.median(p)),max(p)) if p else '', sorted({a['race'] for a in ads})[:3]); sys.stdout.flush()
            break
    else: print(f"{slug:38s} introuvable {cands}"); sys.stdout.flush()
json.dump({'releve':'2026-11-18','source':'chiots-de-france.com','races':out},open('releve.json','w'),ensure_ascii=False,indent=1)
