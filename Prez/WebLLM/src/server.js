const express = require('express');
const si = require('systeminformation');
const { exec } = require('child_process');
const app = express();

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/kill-wifi', (req, res) => {
  console.log("Exécution de la coupure Wi-Fi...");

  // Commande pour MacOS (à adapter pour Windows : 'netsh interface set interface...')
  const cmd = "networksetup -setnetworkserviceenabled Wi-Fi off";

  exec(cmd, (err) => {
    if (err) return res.status(500).send(err.message);
    res.send("Wi-Fi coupé avec succès.");
  });
});

function getMemStats() {
    return new Promise((resolve) => {
        exec('sysctl hw.memsize && vm_stat', (err, stdout) => {
            if (err) return resolve({ used: '0.00', total: '0.00' });

            const pageSizeMatch = stdout.match(/page size of (\d+) bytes/);
            const pageSize = parseInt(pageSizeMatch?.[1] ?? 4096);

            const pages = (name) => {
                const m = stdout.match(new RegExp(name + ':\\s+(\\d+)'));
                return m ? parseInt(m[1]) * pageSize : 0;
            };

            const totalMatch = stdout.match(/hw\.memsize:\s*(\d+)/);
            const total = totalMatch ? parseInt(totalMatch[1]) : 0;

            // Activity Monitor "Utilisée" = total - (pages libres + spéculatives) - inactives
            const free     = pages('Pages free') + pages('Pages speculative');
            const inactive = pages('Pages inactive');
            const used     = total - free - inactive;

            resolve({
                used:  (used  / 1024 ** 3).toFixed(2),
                total: (total / 1024 ** 3).toFixed(2),
            });
        });
    });
}

function getGpuStats(callback) {
    // ioreg expose les compteurs IOKit de l'AGXAccelerator (pas de sudo requis)
    exec('ioreg -r -c AGXAccelerator -d 1', (err, stdout) => {
        if (err) return callback({ renderer: 0, tiler: 0, device: 0 });
        const renderer = parseInt((stdout.match(/"Renderer Utilization %"\s*=\s*(\d+)/) || [])[1] || 0);
        const tiler    = parseInt((stdout.match(/"Tiler Utilization %"\s*=\s*(\d+)/)    || [])[1] || 0);
        const device   = parseInt((stdout.match(/"Device Utilization %"\s*=\s*(\d+)/)   || [])[1] || 0);
        callback({ renderer, tiler, device });
    });
}

app.get('/stats', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendStats = () => {
        getGpuStats(async (gpu) => {
            const [memory, net, cpu, graphics] = await Promise.all([
                getMemStats(),
                si.networkStats(),
                si.currentLoad(),
                si.graphics(),
            ]);

            const data = {
                memory,
                cpu: {
                    load: cpu.currentLoad.toFixed(1) // %
                },
                network: {
                    rx: (net[0].rx_sec / 1024).toFixed(2), // KB/s download
                    tx: (net[0].tx_sec / 1024).toFixed(2)  // KB/s upload
                },
                gpu: {
                    model: graphics.controllers[0]?.model || 'GPU',
                    renderer: gpu.renderer, // Renderer Utilization %
                    tiler: gpu.tiler,       // Tiler Utilization %
                    device: gpu.device      // Device Utilization % (global)
                }
            };

            res.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    };

    const interval = setInterval(sendStats, 1000);

    req.on('close', () => clearInterval(interval));
});

app.listen(3000, () => console.log("Serveur de contrôle prêt sur le port 3000"));