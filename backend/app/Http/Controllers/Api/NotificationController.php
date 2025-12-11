<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Liste des notifications de l'utilisateur connecté (ou globales si user_id nul).
     */
    public function index(Request $request): JsonResponse
    {
        $userId = optional($request->user())->id;

        $query = AppNotification::query()
            ->when($userId, fn ($q) => $q->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)->orWhereNull('user_id');
            }))
            ->latest()
            ->limit(50);

        return response()->json($query->get());
    }

    /**
     * Marquer une notification comme lue.
     */
    public function markAsRead(string $id, Request $request): JsonResponse
    {
        $notif = AppNotification::findOrFail($id);
        // Optionnel: vérifier qu'elle appartient au user
        if ($request->user() && $notif->user_id && $notif->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }
        $notif->update(['is_read' => true]);
        return response()->json($notif);
    }

    /**
     * Marquer toutes les notifications de l'utilisateur comme lues.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $userId = optional($request->user())->id;
        AppNotification::query()
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->update(['is_read' => true]);

        return response()->json(['status' => 'ok']);
    }
}

