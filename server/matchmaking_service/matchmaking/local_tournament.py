# import asyncio
# import json
# from asgiref.sync import sync_to_async
# from channels.db import database_sync_to_async
# from django.db  import models
# from .models import Player, User, Match, Tournament, PlayerTournament
# from .serializers import MatchSerializer
# from .exceptions                import CustomAPIException
# import random

# class LocalTournamentMatchmaking:
#     def __init__(self, websocket):
#         self.websocket = websocket

#     async def handle_local_tournament(self):
#         if not id:
#             await self.send(text_data=json.dumps({
#                 'success'   : False,
#                 'error'     : 'Tournament ID is required'
#             }))
#             return

#         try:
#             tournament = await self.get_local_tournament(id)

#             if tournament.status == 'matchmaking':
#                 matches = await self.get_matches_for_local_tournament(id)
#                 await self.send(text_data=json.dumps({
#                     'success': True,
#                     'matches': matches,
#                 }))
#                 return

#             players = await self.get_local_players(id)

#             if not players:
#                 await self.send(text_data=json.dumps({
#                     'success': False,
#                     'error'  : 'No players found in the tournament'
#                 }))
#                 return

#             random.shuffle(players)
#             room_1  = players[:len(players) // 2]
#             room_2  = players[len(players) // 2:]
#             matches = []

#             for player1, player2 in zip(room_1, room_2):
#                 match = await self.create_local_match(tournament, player1, player2)
#                 if match:
#                     matches.append({
#                         'player1_id': match.player1.id,
#                         'player1'   : match.player1.nickname,
#                         'player2_id': match.player2.id,
#                         'player2'   : match.player2.nickname,
#                         'avatar1'   : match.player1.avatar.url if match.player1.avatar else None,
#                         'avatar2'   : match.player2.avatar.url if match.player2.avatar else None,
#                         'status'    : match.status,
#                         'match_id'  : match.id
#                     })

#             await self.send(text_data=json.dumps({
#                 'success': True,
#                 'matches': matches
#             }))
#             await self.update_local_tournament_status(id, 'matchmaking')

#         except LocalTournament.DoesNotExist:
#             await self.send(text_data=json.dumps({
#                 'success': False,
#                 'error'  : 'Tournament not found'
#             }))
#         except Exception as e:
#             raise CustomAPIException("An error occurred during matchmaking: " + str(e))

#     @database_sync_to_async
#     def get_local_players(self, tournament_id):
#         try:
#             tournament  = LocalTournament.objects.get(id=tournament_id)
#             players     = list(tournament.participants.all())
#             return players
#         except LocalTournament.DoesNotExist:
#             return []

#     @database_sync_to_async
#     def get_local_tournament(self, tournament_id):
#         try:
#             tournament = LocalTournament.objects.get(id=tournament_id)
#             return tournament
#         except LocalTournament.DoesNotExist:
#             raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


#     @database_sync_to_async
#     def update_local_tournament_status(self, tournament_id, status):
#         try:
#             tournament          = LocalTournament.objects.get(id=tournament_id)
#             tournament.status   = status

#             tournament.save()
#         except LocalTournament.DoesNotExist:
#             raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


#     @database_sync_to_async
#     def create_local_match(self, tournament, player1, player2):
#         try:
#             match = LocalMatch(
#                 player1     = player1,
#                 player2     = player2,
#                 tournament  = tournament,
#                 status      = 'pending',
#             )
#             match.save()
#             return match
#         except Exception as e:
#             print(f"Error creating match: {e}")
#             return None

#     @database_sync_to_async
#     def get_matches_for_local_tournament(self, tournament_id):
#         try:
#             tournament  = LocalTournament.objects.get(id=tournament_id)
#             matches     = LocalMatch.objects.select_related('player1', 'player2').filter(tournament=tournament)
#             match_data  = [
#                 {
#                     'player1_id': match.player1.id,
#                     'player1'   : match.player1.nickname,
#                     'player2_id': match.player2.id,
#                     'player2'   : match.player2.nickname,
#                     'avatar1'   : match.player1.avatar.url if match.player1.avatar else None,
#                     'avatar2'   : match.player2.avatar.url if match.player2.avatar else None,
#                     'status'    : match.status,
#                     'match_id'  : match.id
#                 }
#                 for match in matches
#             ]
#             return match_data
#         except LocalTournament.DoesNotExist:
#             return []















    # async def receive(self, text_data):
    #     print("---------> receive")

    #     data          = json.loads(text_data)
    #     action        = data.get('action')
    #     tournament_id = data.get('tournamentId')

    #     print("data : --------> ", data)

    #     if action == 'find_opponent':
    #         await self.pair_pvp_players()
    #     if action == 'online_tournament':
    #         await self.pair_online_tournament_players(tournament_id)
    #     # if action == "opponent_disconnected":
    #     #     await self.send_json({
    #     #         "action" : "opponent_disconnected",
    #     #         "message": data["message"]
    #     #     })
    #     # if action == 'local_tournament':
    #     #     await self.pair_local_tournament_players(tournament_id)
    
    

# ----------------------------LOCAL--------------------------------------------------------------------

    # async def pair_local_tournament_players(self, id):
    #     if not id:
    #         await self.send(text_data=json.dumps({
    #             'success'   : False,
    #             'error'     : 'Tournament ID is required'
    #         }))
    #         return

    #     try:
    #         tournament = await self.get_local_tournament(id)

    #         if tournament.status == 'matchmaking':
    #             matches = await self.get_matches_for_local_tournament(id)
    #             await self.send(text_data=json.dumps({
    #                 'success': True,
    #                 'matches': matches,
    #             }))
    #             return

    #         players = await self.get_local_players(id)

    #         if not players:
    #             await self.send(text_data=json.dumps({
    #                 'success': False,
    #                 'error'  : 'No players found in the tournament'
    #             }))
    #             return

    #         random.shuffle(players)
    #         room_1  = players[:len(players) // 2]
    #         room_2  = players[len(players) // 2:]
    #         matches = []

    #         for player1, player2 in zip(room_1, room_2):
    #             match = await self.create_local_match(tournament, player1, player2)
    #             if match:
    #                 matches.append({
    #                     'player1_id': match.player1.id,
    #                     'player1'   : match.player1.nickname,
    #                     'player2_id': match.player2.id,
    #                     'player2'   : match.player2.nickname,
    #                     'avatar1'   : match.player1.avatar.url if match.player1.avatar else None,
    #                     'avatar2'   : match.player2.avatar.url if match.player2.avatar else None,
    #                     'status'    : match.status,
    #                     'match_id'  : match.id
    #                 })

    #         await self.send(text_data=json.dumps({
    #             'success': True,
    #             'matches': matches
    #         }))
    #         await self.update_local_tournament_status(id, 'matchmaking')

    #     except LocalTournament.DoesNotExist:
    #         await self.send(text_data=json.dumps({
    #             'success': False,
    #             'error'  : 'Tournament not found'
    #         }))
    #     except Exception as e:
    #         raise CustomAPIException("An error occurred during matchmaking: " + str(e))

    # @database_sync_to_async
    # def get_local_players(self, tournament_id):
    #     try:
    #         tournament  = LocalTournament.objects.get(id=tournament_id)
    #         players     = list(tournament.participants.all())
    #         return players
    #     except LocalTournament.DoesNotExist:
    #         return []

    # @database_sync_to_async
    # def get_local_tournament(self, tournament_id):
    #     try:
    #         tournament = LocalTournament.objects.get(id=tournament_id)
    #         return tournament
    #     except LocalTournament.DoesNotExist:
    #         raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


    # @database_sync_to_async
    # def update_local_tournament_status(self, tournament_id, status):
    #     try:
    #         tournament          = LocalTournament.objects.get(id=tournament_id)
    #         tournament.status   = status

    #         tournament.save()
    #     except LocalTournament.DoesNotExist:
    #         raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


    # @database_sync_to_async
    # def create_local_match(self, tournament, player1, player2):
    #     try:
    #         match = LocalMatch(
    #             player1     = player1,
    #             player2     = player2,
    #             tournament  = tournament,
    #             status      = 'pending',
    #         )
    #         match.save()
    #         return match
    #     except Exception as e:
    #         print(f"Error creating match: {e}")
    #         return None

    # @database_sync_to_async
    # def get_matches_for_local_tournament(self, tournament_id):
    #     try:
    #         tournament  = LocalTournament.objects.get(id=tournament_id)
    #         matches     = LocalMatch.objects.select_related('player1', 'player2').filter(tournament=tournament)
    #         match_data  = [
    #             {
    #                 'player1_id': match.player1.id,
    #                 'player1'   : match.player1.nickname,
    #                 'player2_id': match.player2.id,
    #                 'player2'   : match.player2.nickname,
    #                 'avatar1'   : match.player1.avatar.url if match.player1.avatar else None,
    #                 'avatar2'   : match.player2.avatar.url if match.player2.avatar else None,
    #                 'status'    : match.status,
    #                 'match_id'  : match.id
    #             }
    #             for match in matches
    #         ]
    #         return match_data
    #     except LocalTournament.DoesNotExist:
    #         return []
        
# ----------------------------------online-------------------------------------------------
        
    # async def pair_online_tournament_players(self, id):

    #     if not id:
    #         await self.send(text_data=json.dumps({
    #             'success': False,
    #             'error'  : 'Tournament ID is required'
    #         }))
    #         return

    #     try:
    #         print("-----> ", id)
    #         tournament = await self.get_online_tournament(id)
    #         print("tournament status : ", tournament.status)
    #         if tournament.status == 'matchmaking':
    #             matches = await self.get_matches_for_online_tournament(id)
    #             await self.send(text_data=json.dumps({
    #                 'success': True,
    #                 'matches': matches,
    #             }))
    #             return

    #         player_entries = await self.get_players_in_online_tournament(id)
    #         players        = await self.get_players_from_entries(player_entries)

    #         players_with_mmv = []
    #         for player in players:
    #             mmv = self.calculate_mmv(player)
    #             players_with_mmv.append((player, mmv))

    #         sorted_players = sorted(players_with_mmv, key=lambda x: x[1])

    #         matches = []
    #         for i in range(0, len(sorted_players), 2):
    #             player1 = sorted_players[i][0]
    #             player2 = sorted_players[i + 1][0] if i + 1 < len(sorted_players) else None

    #             match = await self.create_online_match(id, player1, player2)
    #             if match:
    #                 player1_tournament = await self.get_player_tournament(match.player1, id)
    #                 player2_tournament = await self.get_player_tournament(match.player2, id) if match.player2 else None
                    
    #                 matches.append({
    #                     'player1_id': match.player1.id,
    #                     'player1'   : player1_tournament.nickname,
    #                     'avatar1'   : player1_tournament.avatar.url if player1_tournament.avatar else None,
    #                     'player2_id': match.player2.id if match.player2 else None,
    #                     'player2'   : player2_tournament.nickname if player2_tournament else None,
    #                     'avatar2'   : player2_tournament.avatar.url if player2_tournament and player2_tournament.avatar else None,
    #                     'status'    : match.status,
    #                     'match_id'  : match.id
    #                 })

    #         await self.send(text_data=json.dumps({
    #             "success" : True,
    #             "matches" : matches,
    #         }))
    #         await self.update_online_tournament_status(id, 'matchmaking')

    #     except CustomAPIException as e:
    #         await self.send(text_data=json.dumps({
    #             'success': False,
    #             'error'  : e.message,
    #             'code'   : e.code
    #         }))
    #     except Exception as e:
    #         print(f"Unexpected error during matchmaking: {str(e)}")
    #         raise CustomAPIException(f"An unexpected error occurred during matchmaking: {str(e)}")

    # @database_sync_to_async
    # def get_online_tournament(self, tournament_id):
    #     try:
    #         tournament = Tournament.objects.get(id=tournament_id)

    #         return tournament
    #     except Tournament.DoesNotExist:
    #         raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)
        
    # @database_sync_to_async
    # def create_online_match(self, tournament_id, player1, player2):
    #     try:
    #         tournament     = Tournament.objects.get(id=tournament_id)
    #         match          = Match(
    #             player1    = player1,
    #             player2    = player2,
    #             tournament = tournament,
    #             status     = 'pending',
    #         )
    #         match.save()
            
    #         return match
    #     except Exception as e:
    #         print(f"Error creating match: {e}")
    #         return None

    # @database_sync_to_async
    # def get_player_tournament(self, player, tournament_id):
    #     try:
    #         return PlayerTournament.objects.get(player=player, tournament_id=tournament_id)
    #     except PlayerTournament.DoesNotExist:
    #         return None


    # @database_sync_to_async
    # def get_players_in_online_tournament(self, id):        
    #     """  Fetches players from the given tournament ID. """

    #     try:
    #         tournament      = Tournament.objects.get(id=id)
    #         player_entries  = PlayerTournament.objects.filter(tournament=tournament, status='accepted')
            
    #         print("->>>>>> players: ", player_entries)
    #         return player_entries
    #     except Tournament.DoesNotExist:
    #         raise CustomAPIException(f"Tournament with ID {id} does not exist.")
    #     except Exception as e:
    #         raise CustomAPIException(f"An error occurred while fetching player entries: {str(e)}")

    # @sync_to_async
    # def get_players_from_entries(self, player_entries):
    #     """ Extracts player objects from player entries. """

    #     try:
    #         if not player_entries:
    #             raise ValueError("No player entries found.")
    #         return [entry.player for entry in player_entries]
    #     except AttributeError:
    #         raise CustomAPIException("Invalid player entry structure.")
    #     except Exception as e:
    #         raise CustomAPIException(f"An error occurred while extracting players: {str(e)}")

    # def calculate_mmv(self, player):
    #     """  Calculate the matchmaking value (MMV) for a player based on their level, score, and rank. """

    #     weight_level = 1
    #     weight_score = 2
    #     weight_rank  = 3

    #     mmv = (player.level * weight_level) + (player.score * weight_score) + (player.rank * weight_rank)
    #     return mmv

    # @database_sync_to_async
    # def update_online_tournament_status(self, tournament_id, status):
    #     try:
    #         tournament        = Tournament.objects.get(id=tournament_id)
    #         tournament.status = status

    #         tournament.save()
    #     except Tournament.DoesNotExist:
    #         raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


    # @database_sync_to_async
    # def get_matches_for_online_tournament(self, tournament_id):
    #     try:
    #         tournament = Tournament.objects.get(id=tournament_id)
    #         matches    = Match.objects.select_related('player1', 'player2').filter(tournament=tournament)
            
    #         match_data = []
    #         for match in matches:
    #             player1_tournament = PlayerTournament.objects.get(player=match.player1, tournament=tournament)
    #             player2_tournament = PlayerTournament.objects.get(player=match.player2, tournament=tournament)

    #             match_data.append({
    #                 'player1_id': match.player1.id,
    #                 'player1'   : player1_tournament.nickname,
    #                 'player2_id': match.player2.id,
    #                 'player2'   : player2_tournament.nickname,
    #                 'avatar1'   : player1_tournament.avatar.url if player1_tournament.avatar else None,
    #                 'avatar2'   : player2_tournament.avatar.url if player2_tournament.avatar else None,
    #                 'status'    : match.status,
    #                 'match_id'  : match.id
    #             })
            
    #         return match_data
    #     except Tournament.DoesNotExist:
    #         return []
        
