document.addEventListener('DOMContentLoaded', () => {
  const videoContainer = document.getElementById('videoContainer');
  const selectedGrade = parseInt(localStorage.getItem("selectedGrade") || "1");

  // Grade → Topic → Array of Videos
  const gradeVideos = {
    1: {
      Addition: [
        "https://www.youtube.com/embed/tVHOBVAFjUw?si=PcjsE07zTVVC2ALN",
        "https://www.youtube.com/embed/VScM8Z8Jls0?si=k5eZOMZNGpDEHrQV",
        "https://www.youtube.com/embed/uQiUTFO78Jk?si=YyrqMqSToPj5ktBD"
      ],
      Substraction: [ 
        "https://www.youtube.com/embed/YLPbduEc4sA?si=jfF_ilJdY497LKlQ",
        "https://www.youtube.com/embed/ZygCUtAUWJA?si=EKKD_-wD-Kn44jYp",
        "https://www.youtube.com/embed/1DsR14RMONc?si=OS2ICU15NssvrkAb"
      ]
    },
    2: {
      Addition: [
        "https://www.youtube.com/embed/KgZIXq04ee8?si=KekP8NLry8Ptsixd",
        "https://www.youtube.com/embed/Q9sLfMrH8_w?si=RcCA0j1XoKnYzRGw",
        "https://www.youtube.com/embed/OB6DUaiGLiA?si=__AnXXCq7AMA3zSF"
      ],
      Substraction: [
        "https://www.youtube.com/embed/qKxQ33KcRWQ?si=faMQIStJXGaA0kQG",
        "https://www.youtube.com/embed/ySkjVZ0ym7k?si=T-qTP-dU6UzSnQYh", 
        "https://www.youtube.com/embed/tr7HwZirgHw?si=QWAIWCriVN5_MjOT"
      ]
    },
    3: {
      Addition: [
        "https://www.youtube.com/embed/1Al2Fc3wOIQ?si=9MCh9MSfBQEhLKUD",
        "https://www.youtube.com/embed/wBhwDtn5Xeg?si=qQo2Q0eKZPVsLg1i",
        "https://www.youtube.com/embed/icyEBL9bzAc?si=edHMPtsUJsBDeYKl"
      ],
      Substraction: [
        "https://www.youtube.com/embed/8_X680JiWDc?si=2JD32PYLvniHm1VD",
        "https://www.youtube.com/embed/489srqkdgMQ?si=ZPLsByDGqq87Gudq", 
        "https://www.youtube.com/embed/qKxQ33KcRWQ?si=SUITSXw5GVm4c9DE"
      ],
      Multiplication: [
        "https://www.youtube.com/embed/uup7IC7c1V8?si=vGZv1QpqL6qNAMG9",
        "https://www.youtube.com/embed/MeidqzJNA2o?si=a8hvNcJSx0CwqVrK",
        "https://www.youtube.com/embed/eW2dRLyoyds?si=VRwMfjY4rqi4Malu"
      ]
    },
    4: {
      Addition: [
        "https://www.youtube.com/embed/cE-yrJv4TEs?si=TT5MN7tIWcYW0N-A", 
        "https://www.youtube.com/embed/mAvuom42NyY?si=NrExPb2rpxZJHl58",
        "https://www.youtube.com/embed/1Al2Fc3wOIQ?si=jlhUIz7zkPaev4DM",
      ],
      Substraction: [
        "https://www.youtube.com/embed/cLHu-zuTPk8?si=7yB7OtwuT4UGygco",
        "https://www.youtube.com/embed/tfcZqajFSU8?si=HCmjQ5jC0gX_WK-o", 
        "https://www.youtube.com/embed/489srqkdgMQ?si=1VIl1bceG934eq3r"
      ],
      Multiplication: [
        "https://www.youtube.com/embed/6owKqFWej-w?si=yo1ROo2ik0O9RPo3",
        "https://www.youtube.com/embed/9dYXfZZsbzc?si=m-AMnVz8VTK0hjB0",
        "https://www.youtube.com/embed/-aNSUlo5sSA?si=b9VJ_0zXjIrMF8R4"
      ],
      Division: [
        "https://www.youtube.com/embed/2-sP854NMLw?si=t45NIy_mPJ4T1Oaj",
        "https://www.youtube.com/embed/oF2fITujB4c?si=1Ng2nhTR-Yv4Mszb",
        "https://www.youtube.com/embed/irfMCIgFJZY?si=oij4skaICms56cpk"
      ]
    },
    5: {
      Addition: [
        "https://www.youtube.com/embed/nHQ7VZ2oT9w?si=TNK4MfMSO0mWWBW9",
        "https://www.youtube.com/embed/4AAR_ZgIjPU?si=dqhfZYyCOxZcmjYh",
        "https://www.youtube.com/embed/Akq-yxkwi5k?si=ilJ85NT5Vh4jS2FB"
      ],
      Substraction: [
        "https://www.youtube.com/embed/EaSxvUxheJo?si=1pyooElrMw5XMxuk",
        "https://www.youtube.com/embed/apRK3uYnUMI?si=i9QGbvbD84Q92Zw2",
        "https://www.youtube.com/embed/w3smfQko4QM?si=rsl7hJ1LzPacPP9n"
      ],
      Multiplication: [
        "https://www.youtube.com/embed/0MqP7aeTszM?si=B8gEmJtif1gcded2",
        "https://www.youtube.com/embed/FJ5qLWP3Fqo?si=nZSWAXZUupSn5a4I",
        "https://www.youtube.com/embed/-sxfriO_IV0?si=JBmC1Cv_BJG0rSgv"
      ],
      Division: [
        "https://www.youtube.com/embed/6Ij98BwDcOg?si=C0G3eYniYyhMrjW0",
        "https://www.youtube.com/embed/HdU_rf7eMTI?si=eKKYog9pOmJQ6P6y",
        "https://www.youtube.com/embed/OYilodqVddA?si=vqOyrnIV07JbeDTN"
      ],
      Percentage: [
        "https://www.youtube.com/embed/JeVSmq1Nrpw?si=-Q8Q7JdwkZdkBmEH",
        "https://www.youtube.com/embed/XGOMLR_4zD4?si=qSiJMOF_X9ZWH7IR",
        "https://www.youtube.com/embed/rR95Cbcjzus?si=4v3jRzx-x8HCRdxe"
      ]
    },
    6: {
      Addition: [
        "https://www.youtube.com/embed/mAvuom42NyY?si=3nTEghn9pcFxvgOW",
        "https://www.youtube.com/embed/pynfj2bYRms?si=Pah5Uw8wU1ruxxGy",
        "https://www.youtube.com/embed/rDA5TMlyQ4s?si=iiELS4OOvl7mYKQf"
      ],
      Substraction: [
        "https://www.youtube.com/embed/Y6M89-6106I?si=vaGhGt6RbUP0qRAI",
        "https://www.youtube.com/embed/tP6GBkKVVS0?si=96yWgS-RCWts9c_4",
        "https://www.youtube.com/embed/VeaPMq2U-NQ?si=aHoQPakaFXWF7B2r"
      ],
      Multiplication: [
        "https://www.youtube.com/embed/SZ5RUeXWw2M?si=W8cnntQQzqsNyqDM",
        "https://www.youtube.com/embed/7cYcuHZaEME?si=nkSQF8aS-S8K-RSX",
        "https://www.youtube.com/embed/RVYwunbpMHA?si=CQr7yK_rvP-tu04l"
      ],
      Division: [
        "https://www.youtube.com/embed/HdU_rf7eMTI?si=HJ86TyOHu2t9EWX5",
        "https://www.youtube.com/embed/HdU_rf7eMTI?si=eKKYog9pOmJQ6P6y",
        "https://www.youtube.com/embed/LGqBQrUYua4?si=9L4cYWoFbbqlQ0ql"
      ],
      Percentage: [
        "https://www.youtube.com/embed/rR95Cbcjzus?si=tSpTIwR0R_kPnrQ7",
        "https://www.youtube.com/embed/JeVSmq1Nrpw?si=xSchPX_kIb9WxT3V",
        "https://www.youtube.com/embed/NJ31kZey01I?si=YYq-rOHwgnjjQ-aq"
      ]
    }
  };

  function getTopicFromHash() {
    const hash = window.location.hash;
    if (!hash) return null;
    const match = hash.match(/#([A-Za-z]+)/);
    return match ? match[1].replace("Videos", "") : null;
  }

  function renderVideo(topic, videoUrls) {
    const title = document.createElement('h2');
    title.textContent = ` Lets Learn ${topic}`;
    title.className = "text-2xl font-bold mb-6 w-full text-center";
    videoContainer.innerHTML = "";
    videoContainer.appendChild(title);
  
    videoUrls.forEach(url => {
      const wrapper = document.createElement('div');
      wrapper.style.width = "560px";
      wrapper.style.height = "315px";
      wrapper.className = "rounded-xl shadow-lg overflow-hidden";

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = "560";
      iframe.height = "315";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.setAttribute("allowfullscreen", "");

      wrapper.appendChild(iframe);
      videoContainer.appendChild(wrapper);

    });
  }
  

  const topic = getTopicFromHash();
  const videoUrls = gradeVideos[selectedGrade]?.[topic];

  if (videoUrls && videoUrls.length > 0) {
    renderVideo(topic, videoUrls);
  } else {
    videoContainer.innerHTML = `<p class="text-lg text-red-600">No video found for topic <strong>${topic}</strong> in grade <strong>${selectedGrade}</strong>.</p>`;
  }
});
