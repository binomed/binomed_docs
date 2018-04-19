export class AnimationHeader{

	constructor(){
		this.init();
	}

	async init() {
		['--avatar-size', '--header-height', '--font-base', '--bar-height', '--avatar-border']
		  .forEach(name => {
			CSS.registerProperty({
			  name,
			  syntax: '<length>',
			  initialValue: '0px',
			  inherits: true
			});
		  });

		await animationWorklet.addModule('./scripts/houdini/animator-header.js');

		const sizes = document.querySelector('#demoAnimationWorklet').computedStyleMap();
		const scrollSource = document.querySelector('#demoAnimationWorklet');
		const avatar = document.querySelector('#demoAnimationWorklet .avatar');
		const bar = document.querySelector('#demoAnimationWorklet .bar');
		const maxTime = 1000;
		const epsilon = 1e-2;
		const scrollTimeline = new ScrollTimeline({
		  scrollSource,
		  orientation: 'block',
		  timeRange: maxTime,
		});
		// console.log(avatarScrollEndPos, avatarScrollEndOffset);
		// console.log(scrollSize);
		const avatarEffect = new KeyframeEffect(avatar, [
		  {transform: `translateY(0px) scale(1)`, easing: 'ease-in-out', offset: 0},
		  {transform: `translateY(0px) scale(${0/*avatarTargetScale*/})`, easing: 'linear', offset: 0 /*avatarScrollEndOffset*/},
		  {transform: `translateY(${0/*avatarTargetTranslate*/}px) scale(${0/*avatarTargetScale*/})`, offset: 1},
		], {
		  duration: maxTime + epsilon,
		  fill: 'both',
		  iterations: Infinity,
		});

		new WorkletAnimation('animator-header',
		  [avatarEffect],
		  scrollTimeline,
		  {}
		).play();

		const barEffect = new KeyframeEffect(
		  bar,
		  [
			{opacity: 0, offset: 0},
			{opacity: 1, offset: 0 /*avatarScrollEndOffset*/},
			{opacity: 1, offset: 1}
		  ],
		  {
			duration: maxTime + epsilon,
			fill: 'both',
			iterations: Infinity,
			/* crbug(779189): Use infinity iteration and maxDuration to avoid effect
				prematurely finishing.

				BTW, Web Animations uses an endpoint-exclusive timing model, which mean
				when timeline is at "duration" time, it is considered to be at 0 time of the
				second iteration. To avoid this, we ensure our max time (max scroll offset) never
				reaches duration by having duration an epsilon larger.  This hack is not
				needed once we fix the original bug above.
			  */
		  }
		);
		new WorkletAnimation('animator-header',
		  [barEffect],
		  scrollTimeline,
		  {}
		).play();

		function update() {
		  const clientHeight = scrollSource.clientHeight;
		  const scrollHeight = scrollSource.scrollHeight;
		  const maxScroll = scrollHeight - clientHeight;
		  console.log(clientHeight, scrollHeight, maxScroll);
		  const avatarTargetScale = sizes.get('--bar-height').value / (sizes.get('--avatar-size').value + 2 * sizes.get('--avatar-border').value);
		  const avatarScrollEndPos = (sizes.get('--header-height').value/2 - sizes.get('--avatar-size').value/2 - sizes.get('--avatar-border').value);
		  const avatarTargetTranslate = maxScroll - avatarScrollEndPos;
		  // Stop scaling at this offset and start transform.
		  const avatarScrollEndOffset = avatarScrollEndPos / maxScroll;

		  const aekf = avatarEffect.getKeyframes();
		  aekf[1].transform = `translateY(0px) scale(${avatarTargetScale})`;
		  aekf[1].offset = avatarScrollEndOffset;
		  aekf[2].transform = `translateY(${avatarTargetTranslate}px) scale(${avatarTargetScale})`;
		  avatarEffect.setKeyframes(aekf);

		  const bekf = barEffect.getKeyframes();
		  bekf[1].offset = avatarScrollEndOffset;
		  barEffect.setKeyframes(bekf);
		}
		update();
		window.addEventListener('resize', _ => update());

		/* crbug(824782): delay is not working as expected in worklet, instead here we combine
		   what would have been a delayed animation with the other avatar animation but start
		   it at a different offset.

		  new WorkletAnimation('twitter-header',
			[
			  new KeyframeEffect(avatar, [
				{transform: `translateY(0px)`},
				{transform: `translateY(${scrollHeight - clientHeight}px)`},
			  ], {
				delay: avatarScrollEndPos/scrollHeight * maxTime,
				duration: (scrollHeight - clientHeight)/scrollHeight * maxTime,
				fill: 'both',
			  }),
			],
			scrollTimeline,
			{}
		  )//.play();
		*/
	}

}

