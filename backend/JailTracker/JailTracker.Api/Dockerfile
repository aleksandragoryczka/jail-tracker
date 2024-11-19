FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["JailTracker.Api/JailTracker.Api.csproj", "JailTracker.Api/"]
COPY ["JailTracker.Common/JailTracker.Common.csproj", "JailTracker.Common/"]
COPY ["JailTracker.Database/JailTracker.Database.csproj", "JailTracker.Database/"]
COPY ["JailTracker.Infrastructure/JailTracker.Infrastructure.csproj", "JailTracker.Infrastructure/"]

RUN dotnet restore "JailTracker.Api/JailTracker.Api.csproj"

COPY . .

WORKDIR "/src/JailTracker.Api"
RUN dotnet build "JailTracker.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "JailTracker.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JailTracker.Api.dll"]
