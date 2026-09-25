from pathlib import Path
from xml.etree import ElementTree as ET
import re, sys
ns='{http://www.w3.org/2000/svg}'
ET.register_namespace('',ns[1:-1])
path_re=re.compile(r'M(\d+(?:\.\d+)?) (\d+(?:\.\d+)?) V(\d+(?:\.\d+)?) H(\d+(?:\.\d+)?) V(\d+(?:\.\d+)?)')
for path in map(Path,sys.argv[1:]):
 root=ET.parse(path).getroot()
 boxes=[]
 for rect in root.findall(ns+'rect'):
  if 'x' in rect.attrib:
   x=float(rect.attrib['x']);y=float(rect.attrib['y']);w=float(rect.attrib['width']);h=float(rect.attrib['height'])
   labels=[t for t in root.findall(ns+'text') if abs(float(t.attrib.get('x','-999'))-(x+w/2))<2 and y<float(t.attrib.get('y','-999'))<y+h]
   boxes.append((rect,x,y,w,h,labels))
 vps=[box for box in boxes if box[2]<200 and any(re.search(r'vice.pr.siden',t.text or '',re.I) for t in box[5])]
 presidents=[box for box in boxes if box[2]<100 and any(re.search(r'pr.siden',t.text or '',re.I) for t in box[5])]
 if not presidents:presidents=[box for box in boxes if box[2]<100]
 if not vps or len(presidents)!=1:continue
 president=presidents[0];center=president[1]+president[3]/2
 directors=sorted((b[1]+b[3]/2 for b in boxes if b[2]<200 and b not in vps and b is not president))
 if not directors:continue  # Already laid out beneath the vice-presidency.
 new_centers=[center+(i-(len(vps)-1)/2)*245 for i in range(len(vps))]
 old_centers=[v[1]+v[3]/2 for v in vps]
 for box in boxes:
  rect,x,y,w,h,labels=box
  if box in vps:
   dx=new_centers[vps.index(box)]-(x+w/2)
   rect.set('x',str(round(x+dx,2)).rstrip('0').rstrip('.'))
   for t in labels:t.set('x',str(round(float(t.attrib['x'])+dx,2)).rstrip('0').rstrip('.'))
  elif box is not president:
   rect.set('y',str(int(y+125)))
   for t in labels:t.set('y',str(int(float(t.attrib['y'])+125)))
 for shape in root.findall(ns+'path'):
  m=path_re.fullmatch(shape.attrib.get('d',''))
  if not m:continue
  sx,sy,mid,ex,ey=map(float,m.groups())
  if sy<150:
   if any(abs(ex-old)<2 for old in old_centers):
    index=min(range(len(vps)),key=lambda i:abs(ex-old_centers[i]));ex=new_centers[index]
   else:
    index=min(len(vps)-1,directors.index(min(directors,key=lambda cx:abs(cx-ex)))*len(vps)//len(directors));sx=new_centers[index];sy=228;ey+=125
  else:sy+=125;ey+=125
  mid=(sy+ey)/2
  shape.set('d',f'M{sx:g} {sy:g} V{mid:g} H{ex:g} V{ey:g}')
 width,height=map(int,root.attrib['viewBox'].split()[2:]);root.set('viewBox',f'0 0 {width} {height+125}')
 ET.indent(root)
 ET.ElementTree(root).write(path,encoding='unicode')
 print(path.name, len(vps), len(boxes))
