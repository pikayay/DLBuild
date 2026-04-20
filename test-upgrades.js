const upgrades = [
  { name: "AbilityCooldown", bonus: -12 },
  { name: "Damage", bonus: "30" },
  { name: "FireRateSlow", bonus: "20" },
  { name: "Health", bonus: "+50" }
];
const properties = {
  "AbilityCooldown": { prefix: "{s:sign}", postfix: "s", label: "Cooldown" },
  "Damage": { prefix: undefined, postfix: "", label: "Damage" },
  "FireRateSlow": { prefix: "-", postfix: "%", label: "Fire Rate" },
  "Health": { label: "Health" }
};
const desc = upgrades.map(u => {
  const propDef = properties[u.name];
  let val = String(u.bonus);
  if (propDef?.prefix && propDef.prefix !== '{s:sign}') {
    if (propDef.prefix === '-' && !val.startsWith('-')) {
      val = '-' + val;
    } else if (propDef.prefix !== '-') {
      val = propDef.prefix + val;
    }
  } else if (!val.startsWith('-') && !val.startsWith('+')) {
    val = '+' + val;
  }
  const postfix = propDef?.postfix || '';
  const label = propDef?.label || u.name;
  return `<span class="highlight">${val}${postfix}</span> ${label}`;
}).join(' and ');
console.log(desc);
