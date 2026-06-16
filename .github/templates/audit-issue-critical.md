---
name: "🔴 Critical Security Finding"
about: Critical security issue from PPG audit requiring immediate action
title: "[CRITICAL] {title}"
labels: ["security-audit", "critical", "needs-investigation"]
---

## 🔴 Critical Severity

This finding requires **immediate action** and represents a significant security risk.

## 🎯 Issue Summary

**Title:** {title}

**Affected File(s):**
- {file}:{line}

**Cluster:** {cluster}

## 📋 Evidence

{evidence}

## 💥 Impact

- **Type:** {dimension}
- **Scope:** Cross-tenant data exposure / Authentication bypass / Remote code execution
- **Affected Users:** All administrators
- **Data Risk:** API credentials, hosting access, multi-tenant isolation

## ✅ Recommended Fix

{fix}

## 🔍 Verification

- [ ] Fix has been implemented
- [ ] Code review completed
- [ ] Tests added/updated
- [ ] Tested in staging environment
- [ ] No regression in related functionality
- [ ] Security review approved

## 📝 Additional Context

**Audit Details:**
- Source: 2026-06-16 Comprehensive PPG Security Audit
- Confirmed: Yes
- Agent Count: 111 agents involved

**Related Issues:** Link any related security issues

**Deadline:** Should be fixed within 7 days

---

## 🚀 Developer Notes

For questions about this finding, see the detailed audit report:
- Dashboard: https://ppg.pmapartner.com/admin/security-audit
- GitHub Project: https://github.com/sserdarb/antigravity/projects

⚠️ **Do not deploy to production without addressing this issue.**
