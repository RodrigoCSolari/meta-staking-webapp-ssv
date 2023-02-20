export interface Question {
  title: string;
  text: string;
}
export const FAQ = [
  {
    title: "Why stake in this beautiful meta-staking pool?",
    text: `Several Reasons:<ul>
    <li>You <i>tokenize your stake</i> so now you can use metaETHEREUM in the emerging ETHEREUM DEFI market while you
      keep earning staking rewards. Liberate your stake now!!</li>
    <li>Once you stake here, you can do <i>Liquid Unstakes</i>, meaning you can get your ETHEREUM back without
      waiting several days</li>
    <li>You avoid putting all eggs in one basket. This contract distributes it’s delegated funds into several
      validators, so you greatly reduce the risk of getting no-rewards due to validator outages</li>
    <li>By distributing stake, you contribute to decentralization and censorship-resistance for the ETHEREUM
      protocol</li>`,
  },
  {
    title: "What's metaETHEREUM?",
    text: `<b>metaETHEREUM</b> is the token this contract manages,
    representing your share of the MetaPool stake. After staking, you can use your metaETHEREUM in other markets while
    still earning rewards.
    After each epoch, the metaETHEREUM price will increase as staking-rewards are added to the pool.
    <b>metaETHEREUM</b> price will always increase as long as there are staking rewards.`,
  },
  {
    title: `How does the "Liquid Unstake" works?`,
    text: `Within the contract there's a <i>Liquidity Pool</i>, the pool works like an
    "single-direction swap pool" allowing you to swap <b>metaETHEREUM</b> for ETHEREUM paying a "swap fee".
    The fee increases when there's low liquidity in the pool and decreases when the liquidity is abundant.`,
  },
  {
    title: `Why my staking is not reflected in the "staking" section of my ETHEREUM Wallet?`,
    text: `Good question! The meta-pool staking is reflected in you holding <b>metaETHEREUM tokens</b>,
    it will not be reflected in the wallet as "staking", it will be reflected as <b>metaETHEREUM tokens</b>`,
  },
  {
    title: `I want to know more about the meta-pool`,
    text: `Join us in our <a style="color:#8542eb;text-decoration:underline" href="https://discord.gg/tG4XJzRtdQ">Discord Server</a>.<br><br>
    Follow us on <a style="color:#8542eb;text-decoration:underline" href="https://twitter.com/meta_pool">Twitter</a> and <a style="color:#8542eb;text-decoration:underline"
      href="https://medium.com/@meta_pool">Medium</a><br><br>
    The Open Source documentation for the protocol is in this <a style="color:#8542eb;text-decoration:underline"
      href="https://github.com/Narwallets/meta-pool">Github repo</a>.<br><br>
    Please review the <a style="color:#8542eb;text-decoration:underline" href="https://metapool.app/Tokenomics__Governance_-_Meta_Pool_v4.pdf">Tokenomics &amp;
      Governance</a> and <a style="color:#8542eb;text-decoration:underline" href="https://metapool.app/legal-notice-risk-disclosures.html">Legal &amp; Risk
      Disclosure</a>.`,
  },
];
