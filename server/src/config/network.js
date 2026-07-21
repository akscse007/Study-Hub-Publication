import dns from "node:dns";

// Prefer IPv4 when a hostname has both A and AAAA records; IPv6 remains usable
// when it is the only available address family.
dns.setDefaultResultOrder("ipv4first");
