import { useState } from 'react'
import confetti from 'canvas-confetti'

function BirthdayModal({setBirthday}) {
  const [step, setStep] = useState(0)
  const [choiceMsg, setChoiceMsg] = useState('')

  const popHearts = (big = false) => {
    confetti({
      particleCount: big ? 140 : 30,
      spread: big ? 160 : 70,
      origin: { y: 0.65 },
      shapes: ['heart'],
      colors: ['#ff4d6d', '#ff758f', '#ff8fab'],
      scalar: big ? 1.3 : 1
    })
  }

  const handleHeartClick = () => {
    if (step !== 0) return
    popHearts(true)
    setStep(1)
  }

  const nextStep = (stepNo) => {
    popHearts()
    setStep(stepNo)
  }

  const wrongChoice = (msg) => {
    setChoiceMsg(msg)
    popHearts(false)
  }

  const correctChoice = () => {
    popHearts(true)
    setChoiceMsg('')
    setStep(3)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-zinc-800 text-center flex flex-col items-center">

        {/* STEP 0 – Beating heart */}
        {step === 0 && (
          <>
            <img
              src="/surprise/heart.gif"
              className="w-48 h-48 cursor-pointer"
              onClick={handleHeartClick}
            />
            <p className="text-zinc-400 text-sm mt-6">
              Tap the heart ❤️
            </p>
          </>
        )}

        {/* STEP 1 – Birthday reveal */}
        {step === 1 && (
          <>
            <img src="/surprise/gb2.gif" className="object-contain" />
            <p className="text-zinc-700 font-medium mt-6">
              Kanmani ❤️
            </p>
            <button
              onClick={() => nextStep(2)}
              className="mt-6 bg-emerald-500 px-4 py-1 rounded-xl font-semibold hover:bg-emerald-400"
            >
              Next →
            </button>
          </>
        )}

        {/* STEP 2 – Choose your gift */}
        {step === 2 && (
          <>
            <img src="/surprise/hb.gif" className="mb-4" />

            <h2 className="text-xl font-semibold mb-4">
              Choose one gift 🎁
            </h2>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => wrongChoice('😏 Money comes and goes')}
                className="border rounded-xl py-3 hover:bg-zinc-100"
              >
                💰 10 Million Dollars
              </button>

              <button
                onClick={() => wrongChoice('🌍 We can go together')}
                className="border rounded-xl py-3 hover:bg-zinc-100"
              >
                🌍 World trip
              </button>

              <button
                onClick={correctChoice}
                className="bg-pink-500 text-white rounded-xl py-3 hover:bg-pink-600"
              >
                💌 My Love
              </button>
            </div>

            {choiceMsg && (
              <p className="text-sm text-zinc-500 mt-4 animate-pulse">
                {choiceMsg}
              </p>
            )}
          </>
        )}

        {/* STEP 3 – Next reveal (love letter, hug GIF, etc.) */}
        {step === 3 && (
          <>
            <p className="text-l font-semibold text-pink-600">
              I knew you would chose my love💖
            </p>
            <img src="/surprise/me.jpeg" width={"150px"} alt="" />
<p className="text-sm font-semibold text-pink-600">
              So here's flowers for you on your birthday💐
            </p>
            <button
              onClick={() => nextStep(4)}
              className="mt-6 bg-emerald-500 px-4 py-1 rounded-xl font-semibold hover:bg-emerald-400"
            >
              Continue →
            </button>
          </>
        )}

        {step === 4 && (
          <>
           <p className="text-sm font-semibold text-pink-600">
              Always remember
            </p>
            <img src="/surprise/lov.gif" width={"200px"} alt="" />

            <button
              onClick={() => nextStep(5)}
              className="mt-6 bg-emerald-500 px-4 py-1 rounded-xl font-semibold hover:bg-emerald-400"
            >
              Continue →
            </button>
          </>
        )}
        {step === 5 && (
          <>
           <p className="text-sm font-semibold text-pink-600">
              You are the best thing thats ever happened to me ❤️
            </p>
            <img src="/surprise/kiss.gif" width={"200px"} alt="" />
<p className="text-sm font-semibold text-pink-600">
              I love you so much❤️
            </p>
            <button
              onClick={() => nextStep(6)}
              className="mt-6 bg-emerald-500 px-4 py-1 rounded-xl font-semibold hover:bg-emerald-400"
            >
                
              Continue →
            </button>
          </>
        )}

         {step === 6 && (
          <>
           <p className="text-sm font-semibold text-pink-600">
              I want to give all my love to you ❤️
            </p>
            <img src="/surprise/love2.gif" width={"200px"} alt="" />
<p className="text-sm font-semibold text-pink-600">
              I'm crazy for you my girl
            </p>
            <button
              onClick={() => nextStep(7)}
              className="mt-6 bg-emerald-500 px-4 py-1 rounded-xl font-semibold hover:bg-emerald-400"
            >
                
              Continue →
            </button>
          </>
        )}


        {step === 7 && (
  <div className="flex flex-col items-center">

    {/* Photo stack */}
    <div className="relative w-72 h-56 mb-8">

      <img
        src="/surprise/photo2.jpeg"
        className="absolute left-50 top-15 w-40 rotate-[-8deg] rounded-xl shadow-lg"
      />

      <img
        src="/surprise/photo3.jpeg"
        className="absolute right-50 top-18 w-40 rotate-[8deg] rounded-xl shadow-lg"
      />

      <img
        src="/surprise/photo1.jpeg"
        className="absolute left-1/2 top-0 w-44 -translate-x-1/2 rotate-[0deg] rounded-xl shadow-xl z-10"
      />

    </div>

    {/* Text */}
    <p className="text-zinc-700 text-center text-sm leading-relaxed px-4">
      <span className="block font-medium text-pink-500">
        Every moment with you feels like home.
      </span>
      <span className="block mt-2">
        Let’s make more memories,
        more laughs,
        and endless adventures together.
      </span>
    </p>

    <button
      onClick={() => nextStep(8)}
      className="mt-6 bg-emerald-500 text-black px-5 py-2 rounded-xl font-semibold"
    >
      Next →
    </button>

  </div>
)}


{step === 8 && (
  <div className="flex flex-col items-center">

    {/* Photo stack */}
    <div className="relative w-72 h-56 mb-8">

      <img
        src="/surprise/smile1.jpeg"
        className="absolute left-50 top-0 w-30  rounded-xl shadow-lg"
      />

      <img
        src="/surprise/smile2.jpeg"
        className="absolute right-50 top-1 w-30  rounded-xl shadow-lg"
      />

      <img
        src="/surprise/smile3.jpeg"
        className="absolute left-1/2 top-0 w-30 -translate-x-1/2  rounded-xl shadow-xl z-10"
      />

    </div>

    {/* Text */}
    <p className="text-zinc-700 text-center text-sm leading-relaxed px-4">
      <span className="block font-medium text-pink-500">
        Your smile brings so much calm.
I hope today and all the coming days gives you a thousand reasons to keep it.💕
      </span>
      <span className="block mt-2">
        It's your birthday. Keep on smiling
      </span>
    </p>

    <button
      onClick={() => nextStep(9)}
      className="mt-6 bg-emerald-500 text-black px-5 py-2 rounded-xl font-semibold"
    >
      Next →
    </button>

  </div>
)}
{step === 9 && (
  <div className="flex flex-col items-center">
<img src="surprise/letter.gif" alt="" />
  
    {/* Text */}
    <p className="text-zinc-700 text-center text-sm leading-relaxed px-4"  >
      <span className="block font-medium text-pink-500">
      Here’s something special for you.
Happy Birthday.💕
      </span>
   
    </p>

    <button
      onClick={() => nextStep(10)}
      className="mt-6 bg-emerald-500 text-black px-5 py-2 rounded-xl font-semibold" style={{marginTop:'10px'}}
    >
      Open
    </button>

  </div>
)}
{step === 10 && (
  <div className="flex flex-col items-center" style={{height:'250px',overflowY:'scroll',fontFamily: '"Dancing Script", cursive' }}>
<img src="surprise/letimg.jpeg" alt="" />
  
    {/* Text */}
    <p className="text-zinc-700 text-center text-sm leading-relaxed px-4" >
      <div className="letter text-zinc-700 text-sm leading-relaxed space-y-4 flex flex-col items-start" style={{textAlign:'left'}} >

  <p>
    <strong>Hi Kanmani 💕</strong>
  </p>

  <p >
    Wishing you a very happy birthday.  
    It’s your second birthday after we got together, and let me tell you -  
    I love you a thousand times more now.
  </p>
<br />
  <p>
    It’s such a beautiful day… your birthday.  
    It’s <strong>your</strong> day to be happy, my love, and I’m so glad that I’m by your side today.  
    I wish to be by your side forever, through all your birthdays.
  </p>
<br />
  <p>
    I want to kiss you today… and I want to kiss you with the same love even when there are no teeth in your mouth 😂  
    But hey, that will surely help for something else 😉
  </p>
<br />
  <p>
    Ayisha, let me talk about <strong>you</strong>.
  </p>
<p>Girl.</p>
  <p>
      
    You are just a <strong>wow</strong> girl.  
    You are sooo damn beautiful 🥹 - so pretty, like an angel.  
    I’m honestly in awe knowing that you are mine.  
    I’m so proud to say that you are my girlfriend.
  </p>
<br />
  <p>
    You are emotionally so mature. You never let me down.  
    You always try to uplift me, teach me, and advise me - and I love that about you.  
    You have such clear directions on things.  
    Even when I don’t follow them (sorry 😅), your advice is always lit.
  </p>
<br />
  <p>
    And with all that maturity, you still have the heart of a kid.  
    It’s so beautiful when you become that kid in front of me,  
    so I can take care of you like a baby 🥺❤️
  </p>
<br />
  <p>
    I love everything about you, my love.  
    Your eyes… damn, those eyes.  
    They’re so charming, and every time I look into them,  
    I fall in love with you more and more.
  </p>
<br />
  <p>
    You are such a sexy girl -  
    I really struggle to control myself when I’m with you 😌🔥
  </p>
<br />
  <p>
    Ayisha, you may not always feel like you’re worth it,  
    but girl… you are <strong>sooo worth it</strong>.  
    As a friend, as a partner, as anything - you are amazing at it all.
  </p>
<br />
  <p>
    I’m really freaking happy that you are my best friend,  
    my lover, and my soon-to-be wife ❤️
  </p>
<br />
  <p>
    You are such a sweet daughter - your parents are always proud of you.  <br />
    You are such a sweet sibling; Pathu is really lucky to have you as her sister.  <br />
    And you are such a good friend to all your friends.
  </p>
<br />
  <p>
    Be yourself.  
    Don’t care about anyone’s opinions about you.  
    You are perfect just the way you are.
  </p>
<br />
  <p>
    Smile a little more and live your life fully.  
    And we can live it together -  
    with lots of fun, laughs, adventures, travels, and everything else.  
    Let’s do it together 🤍
  </p>
<br />
  <p>
    Once again, happy birthday, my love.  
    Today is yours, Kanmani. Be happy. Smile a lot.
  </p>
<br />
  <p>
    Here’s to many more years of <strong>your</strong> life - and our life together.  
    Let me be by your side always, loving you ❤️
  </p>

</div>

   
    </p>


    <button
      onClick={() => nextStep(11)}
      className="mt-6 bg-emerald-500 text-black px-5 py-2 rounded-xl font-semibold" style={{marginTop:'10px'}}
    >
      ❤️
    </button>

  </div>
)}
{step ===11 && (
  <div className="flex flex-col items-center">
  <img src="/surprise/ll.gif" alt="" />
    <button style={{marginTop:'20px'}}
      onClick={() => setBirthday(false)}
      className="mt-6 bg-emerald-500 text-black px-5 py-2 rounded-xl font-semibold"
    >
      Ok bye🔸
    </button>

  </div>
)}

      </div>
    </div>
  )
}

export default BirthdayModal
