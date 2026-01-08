# Render Deployment Guide for CollabVoice Backend

## Overview

This guide explains how to deploy the CollabVoice Flask backend on [Render](https://render.com) with the correct Python version to avoid compatibility issues with `psycopg2-binary`.

## Common Issue: Python 3.13 Incompatibility

### The Error

```
ImportError:
/psycopg2/_psycopg.cpython-313-x86_64-linux-gnu.so:
undefined symbol: _PyInterpreterState_Get
```

### Root Cause

This error occurs because `psycopg2-binary` is not compatible with Python 3.13. Render defaults to the latest Python version (currently 3.13), and if the Python version isn't properly pinned, the deployment will fail.

---

## Why Render Might Ignore Your `runtime.txt`

There are several reasons Render might still use Python 3.13 despite having a `runtime.txt`:

### 1. Wrong File Location

**Key Rule**: Render looks for `runtime.txt` in the **service's root directory**, not the repository root.

For this monorepo structure:
```
Collabvoice/
├── Backend/         ← Service root (set in Render dashboard)
│   ├── runtime.txt  ✅ Correct location
│   └── ...
├── Frontend/
└── runtime.txt      ❌ Only works if service root is repo root
```

### 2. Build Cache

Render caches build environments. After adding/modifying `runtime.txt`:
- Go to Render dashboard → Your service → Settings
- Click "Clear Build Cache & Deploy"

### 3. Render Blueprint Overrides

If using `render.yaml`, environment variables take precedence over `runtime.txt`.

---

## Correct Solutions (Pick One)

### Solution 1: `runtime.txt` in Service Root (Already Done)

Ensure `Backend/runtime.txt` exists with content:
```
python-3.11.9
```

**Format Requirements:**
- Must start with `python-`
- No trailing spaces or extra lines
- Exact version (e.g., `3.11.9`, not just `3.11`)

### Solution 2: Environment Variable (Most Reliable)

Set `PYTHON_VERSION` in Render dashboard:

1. Go to Render Dashboard → Your Service → Environment
2. Add environment variable:
   - Key: `PYTHON_VERSION`
   - Value: `3.11.9`
3. Click "Save Changes"
4. Manually redeploy

**This is the most reliable method** as it overrides any file-based configuration.

### Solution 3: Render Blueprint (`render.yaml`)

Use the included `render.yaml` at the repository root. This file:
- Specifies `PYTHON_VERSION: 3.11.9` as an environment variable
- Sets the correct `rootDir: Backend`
- Configures build and start commands

To use the Blueprint:
1. Go to Render Dashboard → Blueprints
2. Click "New Blueprint Instance"
3. Connect your repository
4. Render will auto-detect `render.yaml`

---

## Step-by-Step Production Fix

### If You're Manually Managing the Service:

1. **Verify `runtime.txt` placement**:
   ```
   Backend/runtime.txt
   ```
   Content:
   ```
   python-3.11.9
   ```

2. **Add environment variable as backup**:
   - Render Dashboard → Environment
   - Add: `PYTHON_VERSION` = `3.11.9`

3. **Clear cache and redeploy**:
   - Render Dashboard → Settings → "Clear Build Cache & Deploy"

4. **Verify in build logs**:
   Look for:
   ```
   ==> Using Python version 3.11.9 from runtime.txt
   ```

### If Using Infrastructure as Code (Recommended):

1. **Use the included `render.yaml`** in the repository root
2. Create a Blueprint instance in Render
3. Blueprint will handle Python version automatically

---

## psycopg2 vs psycopg (v3): Which Should You Use?

### Current: `psycopg2-binary`

**Pros:**
- Well-established, battle-tested
- Pre-compiled binaries (fast install)
- Wide community support

**Cons:**
- Binary compatibility issues with newer Python versions
- Slower to support new Python releases
- `psycopg2-binary` is not recommended for production by maintainers

### Alternative: `psycopg` (Version 3)

**Pros:**
- Modern, async-first architecture
- Better Python 3.10+ compatibility
- Pure Python fallback (`psycopg[binary]`)
- Active development with faster updates
- Native asyncio support

**Cons:**
- Slightly different API (migration required)
- Some older tutorials/docs reference psycopg2

### Recommendation

For **new projects** or if you're experiencing compatibility issues, consider migrating to `psycopg`:

```txt
# In requirements.txt
# Replace:
# psycopg2-binary==2.9.9
# With:
psycopg[binary]==3.1.18
```

**Migration Guide**: https://www.psycopg.org/psycopg3/docs/basic/from_pg2.html

For **existing production systems**, pinning Python to 3.11 with `psycopg2-binary` is the safer short-term fix.

---

## Quick Reference: File Locations

| File | Location | Purpose |
|------|----------|---------|
| `runtime.txt` | `Backend/` | Pin Python version for Render |
| `runtime.txt` | `/` (root) | Only if service root is repo root |
| `render.yaml` | `/` (root) | Infrastructure as Code (Blueprint) |
| `requirements.txt` | `Backend/` | Python dependencies |

---

## Verification

After deployment, verify the correct Python version:

1. Check Render build logs for:
   ```
   ==> Using Python version 3.11.9
   ```

2. Add a debug endpoint (optional):
   ```python
   import sys
   
   @app.route('/api/debug/python-version')
   def python_version():
       return {'python_version': sys.version}
   ```

---

## Troubleshooting

### Still seeing Python 3.13?

1. **Check service root directory** in Render dashboard
2. **Clear build cache** and redeploy
3. **Set `PYTHON_VERSION` env var** as override
4. **Verify `runtime.txt` format** (no extra spaces/lines)

### Build fails with pip errors?

1. Ensure `requirements.txt` is in the service root directory
2. Check that all package versions are compatible with Python 3.11

---

## Support

For Render-specific issues: https://community.render.com/
For psycopg issues: https://github.com/psycopg/psycopg
