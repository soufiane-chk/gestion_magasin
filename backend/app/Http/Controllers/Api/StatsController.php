<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Produit;
use Carbon\Carbon;

class StatsController extends Controller
{
    /**
     * Return high-level stats and a time series based on requested period.
     * Supported periods: days (14d), weeks (12w), months (12m), years (5y)
     */
    public function overview(Request $request)
    {
        $totalRevenue = (float) Commande::sum('Total_TTC');
        $totalOrders = (int) Commande::count();

        $today = Carbon::today();
        $todayRevenue = (float) Commande::whereDate('date_Commande', $today)->sum('Total_TTC');
        $todayOrders = (int) Commande::whereDate('date_Commande', $today)->count();

        // Low stock items (threshold 5)
        $lowStockCount = (int) Produit::where('Qt_Stock', '<=', 5)->count();

        // Determine period
        $period = strtolower($request->query('period', 'days'));
        $map = [
            'jours' => 'days',
            'jour' => 'days',
            'semaine' => 'weeks',
            'semaines' => 'weeks',
            'mois' => 'months',
            'annee' => 'years',
            'année' => 'years',
        ];
        $period = $map[$period] ?? $period;

        $series = [];

        if ($period === 'weeks') {
            // last 12 weeks buckets
            $buckets = [];
            $index = [];
            for ($i = 11; $i >= 0; $i--) {
                $start = Carbon::today()->startOfWeek()->subWeeks($i);
                $end = (clone $start)->endOfWeek();
                $key = 'week:' . $start->toDateString();
                $label = 'S' . $start->weekOfYear;
                $buckets[] = [ 'key' => $key, 'start' => $start, 'end' => $end, 'label' => $label, 'total' => 0.0, 'orders' => 0 ];
                $index[$key] = count($buckets) - 1;
            }
            $from = $buckets[0]['start'];
            $to = $buckets[count($buckets)-1]['end'];
            $cmds = Commande::whereDate('date_Commande', '>=', $from->toDateString())
                ->whereDate('date_Commande', '<=', $to->toDateString())
                ->get();
            foreach ($cmds as $c) {
                $d = Carbon::parse($c->date_Commande)->startOfWeek()->toDateString();
                $key = 'week:' . $d;
                if (isset($index[$key])) {
                    $i = $index[$key];
                    $buckets[$i]['total'] += (float)$c->Total_TTC;
                    $buckets[$i]['orders'] += 1;
                }
            }
            foreach ($buckets as $b) {
                $series[] = ['label' => $b['label'], 'total' => $b['total'], 'orders' => $b['orders']];
            }
        } elseif ($period === 'months') {
            // last 12 months buckets
            $buckets = [];
            $index = [];
            for ($i = 11; $i >= 0; $i--) {
                $start = Carbon::today()->startOfMonth()->subMonths($i);
                $end = (clone $start)->endOfMonth();
                $key = 'month:' . $start->format('Y-m');
                $label = $start->format('Y-m');
                $buckets[] = [ 'key' => $key, 'start' => $start, 'end' => $end, 'label' => $label, 'total' => 0.0, 'orders' => 0 ];
                $index[$key] = count($buckets) - 1;
            }
            $from = $buckets[0]['start'];
            $to = $buckets[count($buckets)-1]['end'];
            $cmds = Commande::whereDate('date_Commande', '>=', $from->toDateString())
                ->whereDate('date_Commande', '<=', $to->toDateString())
                ->get();
            foreach ($cmds as $c) {
                $d = Carbon::parse($c->date_Commande)->format('Y-m');
                $key = 'month:' . $d;
                if (isset($index[$key])) {
                    $i = $index[$key];
                    $buckets[$i]['total'] += (float)$c->Total_TTC;
                    $buckets[$i]['orders'] += 1;
                }
            }
            foreach ($buckets as $b) {
                $series[] = ['label' => $b['label'], 'total' => $b['total'], 'orders' => $b['orders']];
            }
        } elseif ($period === 'years') {
            // last 5 years buckets
            $buckets = [];
            $index = [];
            for ($i = 4; $i >= 0; $i--) {
                $start = Carbon::today()->startOfYear()->subYears($i);
                $end = (clone $start)->endOfYear();
                $key = 'year:' . $start->format('Y');
                $label = $start->format('Y');
                $buckets[] = [ 'key' => $key, 'start' => $start, 'end' => $end, 'label' => $label, 'total' => 0.0, 'orders' => 0 ];
                $index[$key] = count($buckets) - 1;
            }
            $from = $buckets[0]['start'];
            $to = $buckets[count($buckets)-1]['end'];
            $cmds = Commande::whereDate('date_Commande', '>=', $from->toDateString())
                ->whereDate('date_Commande', '<=', $to->toDateString())
                ->get();
            foreach ($cmds as $c) {
                $d = Carbon::parse($c->date_Commande)->format('Y');
                $key = 'year:' . $d;
                if (isset($index[$key])) {
                    $i = $index[$key];
                    $buckets[$i]['total'] += (float)$c->Total_TTC;
                    $buckets[$i]['orders'] += 1;
                }
            }
            foreach ($buckets as $b) {
                $series[] = ['label' => $b['label'], 'total' => $b['total'], 'orders' => $b['orders']];
            }
        } else {
            // default: last 14 days
            $buckets = [];
            $index = [];
            for ($i = 13; $i >= 0; $i--) {
                $d = Carbon::today()->subDays($i);
                $key = 'day:' . $d->toDateString();
                $label = $d->format('d/m');
                $buckets[] = [ 'key' => $key, 'date' => $d->toDateString(), 'label' => $label, 'total' => 0.0, 'orders' => 0 ];
                $index[$key] = count($buckets) - 1;
            }
            $from = Carbon::today()->subDays(13);
            $cmds = Commande::whereDate('date_Commande', '>=', $from->toDateString())
                ->whereDate('date_Commande', '<=', Carbon::today()->toDateString())
                ->get();
            foreach ($cmds as $c) {
                $key = 'day:' . Carbon::parse($c->date_Commande)->toDateString();
                if (isset($index[$key])) {
                    $i = $index[$key];
                    $buckets[$i]['total'] += (float)$c->Total_TTC;
                    $buckets[$i]['orders'] += 1;
                }
            }
            foreach ($buckets as $b) {
                $series[] = ['label' => $b['label'], 'total' => $b['total'], 'orders' => $b['orders']];
            }
        }

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'todayRevenue' => $todayRevenue,
            'todayOrders' => $todayOrders,
            'lowStockCount' => $lowStockCount,
            'series' => $series,
            'period' => $period,
        ]);
    }
}
